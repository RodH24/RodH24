import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { FormFunctions } from "@app/data/functions";
import { NewProgram, ProgramType, ModalidadType } from "@app/data/types";
import { ModalidadService, ProgramService } from "@app/data/services";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-modalidad-modal",
  templateUrl: "./modalidad-modal.component.html",
  styleUrls: ["./modalidad-modal.component.scss"],
})
export class ModalidadModalComponent implements OnInit {
  @Input() program: ProgramType = NewProgram;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public showApoyoModal: boolean = false;
  public modalidadIndex: number = 0;
  public formData: UntypedFormGroup;
  public showConfirmModal: boolean = false;
  public confirmModalTitle: string = "";
  public confirmModalMsg: string = "";
  public modalType: "delete" | "pause" | "save" = "delete";

  public get formDataArray(): UntypedFormArray {
    const array = this.formData.get("modalidades");
    return (array ?? []) as UntypedFormArray;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private programService: ProgramService,
    private modalidadService: ModalidadService
  ) {
    this.formData = this.formBuilder.group({
      modalidades: new UntypedFormArray(this.setFormArray()),
    });
  }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      modalidades: new UntypedFormArray(this.setFormArray()),
    });

    this.getProgramDetails();
  }

  /***********************************************/
  /****************** EVENTS ********************/
  /**********************************************/

  public onSave(index: number): void {
    const actualForm = this.formData.get(
      `modalidades.${index.toString()}`
    ) as UntypedFormGroup;

    if (actualForm && actualForm != null) {
      if (!FormFunctions.showFormErrors(actualForm)) {
        return;
      }
      if (this.isInProgram(actualForm)) {
        this.edit(actualForm);
      } else {
        this.create(actualForm);
      }
    }
  }

  public onShowApoyos(isClose: boolean = false, index: number = -1): void {
    if (!isClose) {
      this.modalidadIndex = index;
      const actualForm = this.formData.get(
        `modalidades.${this.modalidadIndex.toString()}`
      ) as UntypedFormGroup;

      if (actualForm && actualForm != null) {
        if (!FormFunctions.showFormErrors(actualForm)) {
          return;
        }
        this.program.modalidades[this.modalidadIndex] = actualForm.value;
      }
    }

    this.showApoyoModal = !this.showApoyoModal;
  }

  public onDocumentChange(change: any, index: number): void {
    const { type, result } = change;
    if (type === "document") {
      this.formData.get(`modalidades.${index}.anexos`)?.patchValue(result);
    } else if (type === "criteria") {
      this.formData
        .get(`modalidades.${index}.elegibilidad.criterior`)
        ?.patchValue(result);
    }
  }

  public onAdd(): void {
    this.formDataArray.push(this.getFormArrayElement());
  }

  public onPause(index: number): void {
    this.modalidadIndex = index;
    this.modalType = "pause";
    this.confirmModalTitle = "Pausar el programa";
    this.confirmModalMsg = "¿Está seguro de pausar el programa?";
    this.showConfirmModal = true;
  }

  public onDelete(index: number, isCancel: boolean = false): void {
    this.modalidadIndex = index;
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

  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onCloseBtn(): void {
    this.onClose.emit(false);
  }

  /******************************************/
  /*************** DATABASE ****************/
  /*****************************************/

  public create(modalidad: UntypedFormGroup): void {
    this.modalidadService.create(
      this.program._id,
      modalidad.value,
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.getProgramDetails();
        }
      }
    );
  }

  public edit(modalidad: UntypedFormGroup): void {
    this.modalidadService.edit(
      this.program.apoyo._id,
      modalidad.value,
      (isSuccess: boolean) => {
        // this.program.modalidades[this.modalidadIndex] = modalidad.value;
        if (isSuccess) {
          this.getProgramDetails();
        }
      }
    );
  }

  public pause(): void {
    const modalidad = this.formDataArray.get(this.modalidadIndex.toString());
    this.modalidadService.pause(
      this.program.apoyo._id,
      modalidad?.value._id,
      !modalidad?.value.habilitado,
      (isSuccess: boolean) => {
        if (isSuccess) {
          modalidad?.patchValue({
            habilitado: !modalidad?.value.habilitado,
          });
        }
      }
    );
  }

  public delete(): void {
    const modalidad = this.formDataArray.get(this.modalidadIndex.toString());
    this.modalidadService.delete(
      this.program._id,
      modalidad?.value._id,
      (isSuccess: boolean) => {
        if (isSuccess) {
          this.formDataArray.removeAt(this.modalidadIndex);
        }
      }
    );
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /*****************************************/

  private getProgramDetails(): void {
    // return;
    // ========
    this.programService.get(this.program._id, null, null, null, null, (program) => {
      this.program = program ?? this.program;
      this.onChange.emit();
    });
  }

  public getPanelTitle(modalidad: AbstractControl) {
    const clave = modalidad.get("clave")?.value;
    const nombre = modalidad.get("nombre")?.value;
    if (nombre && nombre != null && nombre !== "") {
      return clave + ": " + nombre;
    }
    return "Llene el formulario de la nueva modalidad";
  }

  public isInProgram(element: UntypedFormGroup | AbstractControl): boolean {
    const value = element.get("_id")?.value;
    return value && value !== "";
  }

  private setFormArray(): Array<UntypedFormGroup> {
    const arrayValue = [];
    for (const element of this.program.modalidades) {
      arrayValue.push(this.getFormArrayElement(element));
    }
    return arrayValue;
  }

  private getFormArrayElement(element: any = {}): UntypedFormGroup {
    const clave = String(
      this.formData.get("modalidades")?.value.length + 1
    ).padStart(2, "0");
    return this.formBuilder.group({
      _id: [element._id ?? ""],
      clave: [
        element.clave ?? `${this.program.programa.clave}-${clave}`,
        [Validators.required],
      ],
      nombre: [element.nombre ?? "", [Validators.required]],
      objetivoEspecifico: [
        element.objetivoEspecifico ?? "",
        [Validators.required],
      ],
      cedula: [element.cedula ?? false, [Validators.required]],
      etapaVIM: [1, [Validators.required]],
      status: [element.status ?? "Enabled"],
      tipo: [element.tipo ?? "VIM", [Validators.required]],
      habilitado: [element.habilitado ?? true, [Validators.required]],
      metas: [[]],
      tipoApoyo: [element.tipoApoyo ?? []],
      elegibilidad: [
        element.elegibilidad ?? {
          sustentoLegal: "",
          criterios: [],
        },
      ],
      etiquetas: [element.etiquetas ?? [], [Validators.required]],
      pasos: [element.pasos ?? []],
      anexos: [element.anexos ?? []],
      ur: [element.ur ?? {}],
      slas: [element.slas ?? {}],
      raci: [element.raci ?? {}],
    });
  }
}
