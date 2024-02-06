import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { FormFunctions } from "@app/data/functions";
import { ApoyoService, ProgramService } from "@app/data/services";
import { NewProgram, ProgramType } from "@app/data/types";
import { ApoyoType, ModalidadType } from "@app/data/types/programType";

@Component({
  selector: "app-apoyos-modal",
  templateUrl: "./apoyos-modal.component.html",
  styleUrls: ["./apoyos-modal.component.scss"],
})
export class ApoyosModalComponent implements OnInit {
  @Input() program: ProgramType = NewProgram;
  @Input() modalidadIndex: number = 0;
  @Output()
  onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  //
  public apoyoIndex: number = -1;
  //
  public formData: UntypedFormGroup;
  public showConfirmModal: boolean = false;
  public confirmModalTitle: string = "";
  public confirmModalMsg: string = "";
  public modalType: "delete" | "pause" | "save" = "delete";
  public showAdditionalDataModal: boolean = false;
  public arrayFormAdditional: any[] = [];

  public get formDataArray(): UntypedFormArray {
    const array = this.formData.get("apoyos");
    return (array ?? []) as UntypedFormArray;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private programService: ProgramService,
    private apoyoService: ApoyoService
  ) {
    this.formData = this.formBuilder.group({
      apoyos: new UntypedFormArray(this.setFormArray()),
    });
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      apoyos: new UntypedFormArray(this.setFormArray()),
    });
  }

  /***********************************************/
  /****************** EVENTS ********************/
  /**********************************************/

  public onAdd(): void {
    this.formDataArray.push(this.getFormArrayElement());
  }
  
  public arrayFormAdditionalModalPadre(parametros: { arrayFormAdditional: any[], apoyoIndex: number }) {
    //this.arrayFormAdditional = array;
    //this.program.modalidades[this.modalidadIndex].tipoApoyo[this.apoyoIndex].dataAdditional = array;
    this.formDataArray.value[this.apoyoIndex].datosAdicionales = parametros.arrayFormAdditional
  }

  public onPause(index: number): void {
    this.apoyoIndex = index;
    this.modalType = "pause";
    this.confirmModalTitle = "Pausar el programa";
    this.confirmModalMsg = "¿Está seguro de pausar el programa?";
    this.showConfirmModal = true;
  }

  public onDelete(index: number, isCancel: boolean = false): void {
    this.apoyoIndex = index;
    if (isCancel) {
      this.formDataArray.removeAt(this.modalidadIndex);
    } else {
      this.modalType = "delete";
      this.confirmModalTitle = "Eliminar el programa";
      this.confirmModalMsg = "¿Está seguro de eliminar el programa?";
      this.showConfirmModal = true;
    }
  }

  public onModalAccept(isAccept: boolean): void {
    this.showConfirmModal = false;
    if (isAccept) {
      if (this.modalType === "delete") {
        this.delete();
      } else if (this.modalType === "pause") {
        this.pause();
      }
    }
  }

  public onSave(index: number): void {
    this.apoyoIndex = index;
    const actualForm = this.getApoyoForm(this.apoyoIndex) as UntypedFormGroup;
    if (actualForm && actualForm != null) {
      if (!FormFunctions.showFormErrors(actualForm)) {
        return;
      }
      
      if (this.isInModalidad(actualForm)) {
        this.edit(actualForm);
      } else {
        this.create(actualForm);
      }
      
    }
  }

  private isInModalidad(element: UntypedFormGroup | AbstractControl): boolean {
    const value = element.get("_id")?.value;
    return value && value !== "";
  }


  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(): void {
    this.onCloseModal.emit(false);
  }

  /******************************************/
  /*************** DATABASE ****************/
  /*****************************************/

  public create(apoyoForm: UntypedFormGroup): void {
    const modalidad = this.program.modalidades[this.modalidadIndex];
    this.apoyoService.create(
      this.program._id,
      modalidad._id,
      apoyoForm.value,
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.getProgramDetails();
        }
      }
    );
  }

  public edit(apoyoForm: UntypedFormGroup): void {
    const modalidad = this.program.modalidades[this.modalidadIndex];
    this.apoyoService.edit(
      this.program._id,
      modalidad._id,
      apoyoForm.value,
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.getProgramDetails();
        }
      }
    );
  }

  public pause(): void {
    const modalidad = this.program.modalidades[this.modalidadIndex];
    const apoyo = this.getApoyoForm(this.apoyoIndex) as UntypedFormGroup;

    this.apoyoService.pause(
      this.program._id,
      modalidad._id,
      apoyo?.value._id,
      apoyo?.value.habilitado,
      (isSuccess: boolean) => {
        if (isSuccess) {
          apoyo?.patchValue({
            habilitado: !apoyo?.value.habilitado,
          });
        }
      }
    );
  }

  public delete(): void {
    const modalidad = this.program.modalidades[this.modalidadIndex];
    const apoyo = this.getApoyoForm(this.apoyoIndex) as UntypedFormGroup;
    this.apoyoService.delete(
      this.program._id,
      modalidad._id,
      apoyo?.value._id,
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.formDataArray.removeAt(this.apoyoIndex);
          this.getProgramDetails();
        }
      }
    );
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /*****************************************/

  public isInProgram(clave: string): boolean {
    return (
      this.program.modalidades[this.modalidadIndex].tipoApoyo.filter(
        (element: ApoyoType) => element.clave === clave
      ).length > 0
    );
  }

  public getPanelTitle(apoyo: AbstractControl): string {
    const clave = apoyo.get("clave")?.value;
    const nombre = apoyo.get("nombre")?.value;
    if (nombre && nombre != null && nombre !== "") {
      return clave + ": " + nombre;
    }
    return "Llene el formulario del nuevo apoyo";
  }

  private setFormArray(): Array<UntypedFormGroup> {
    const arrayValue = [];
    if (
      this.program.modalidades[this.modalidadIndex] &&
      "tipoApoyo" in this.program.modalidades[this.modalidadIndex]
    ) {

      for (const element of this.program.modalidades[this.modalidadIndex]
        .tipoApoyo) {
        arrayValue.push(this.getFormArrayElement(element));
      }
    }
    return arrayValue;
  }

  private getFormArrayElement(element: ApoyoType | any = {}): UntypedFormGroup {
    const clave = String(
      this.formData.get("apoyos")?.value.length + 1
    ).padStart(2, "0");
    const vigencia = {
      inicio: "2023-01-01T00:00:00.000Z",
      fin: "2023-12-31T23:59:59.000Z",
    };
    return this.formBuilder.group({
      _id: [ element._id ?? ""],
      clave: [
        element.clave ??
          `${this.program.modalidades[this.modalidadIndex].clave}-${clave}`,
        [Validators.required],
      ],
      nombre: [element.nombre ?? "", [Validators.required]],
      vigencia: [element.vigencia ?? vigencia, [Validators.required]],
      flujoSeguimiento: [element.flujoSeguimiento ?? []],
      tipo: [element.tipo ?? "VIM", [Validators.required]],
      habilitado: [element.habilitado ?? true, [Validators.required]],
      datosAdicionales: [element.datosAdicionales ?? [], []]
    });
  }

  public onShowAdditionalDataModal(index: number = -1) {
    this.apoyoIndex = index;
    this.showAdditionalDataModal = !this.showAdditionalDataModal;
  }

  private getApoyoForm(index: number): AbstractControl | null {
    return this.formData.get(`apoyos.${this.apoyoIndex.toString()}`);
  }

  private getProgramDetails(): void {
    this.programService.get(
      this.program._id,
      null,
      null,
      null,
      null,
      (program) => {
        this.program = program ?? this.program;
        this.onChange.emit();
      }
    );
  }
}
