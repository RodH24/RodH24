import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormFunctions } from "@app/data/functions";
import { ProgramType, NewProgram } from "@app/data/types";
import { DependencyService, ProgramService } from "@data/services";

@Component({
  selector: "app-program-modal",
  templateUrl: "./program-modal.component.html",
  styleUrls: ["./program-modal.component.scss"],
})
export class ProgramModalComponent implements OnInit {
  public criteria: Array<string> = [];
  //
  @Input() id: string = "";
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  /** Input forms to new data */
  public dependencyList: any[] = [];
  public program: ProgramType = NewProgram;
  public showModalidadModal: boolean = false;
  public hasChanges: boolean = false;
  // For create
  public formData: FormGroup;
  private selectedDependency: any = {};
  private subscription: any;

  /**
   * Creates the form builder, Fill the program details and the dependency injection
   * @constructor
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ProgramService} programService Custom program service
   * @param {DependencyService} dependencyService Custom dependency service
   */
  constructor(
    private formBuilder: FormBuilder,
    private programService: ProgramService,
    private dependencyService: DependencyService
  ) {
    this.formData = this.createForm();
    this.setSubscription();
  }

  ngOnInit(): void {
    /**
     * If id === '' is create program
     */
    if (this.id === "") {
      this.getDependencyList();
    } else {
      this.getProgramDetails();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /***********************************************/
  /****************** EVENTS ********************/
  /**********************************************/

  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(isRefresh: boolean = false): void {
    this.onCloseModal.emit(isRefresh);
  }

  /**
   * Handle show modalidades modal event
   * Show the modal
   */
  public onShowModalidades(): void {
    this.showModalidadModal = !this.showModalidadModal;
  }

  public onChangeModal(): void {
    this.getProgramDetails();
  }

  /*
    If documents array changes the save buttons will be enabled
  */
  public onDocumentChange(change: any): void {
    const { type, result } = change;
    if (type == "document") {
      this.program.documentos = result;
      this.hasChanges = true;
    }
  }

  /**
   * Handle on save event
   * Calls the service to update the selected program
   */
  public onSave(): void {
    if (this.id === "") {
      this.createProgram();
    } else {
      this.editProgram();
    }
  }

  /*********************************************/
  /***************** DATABASE *****************/
  /*******************************************/

  private getDependencyList(): void {
    this.dependencyService.list(false, (list: any[]) => {
      this.dependencyList = list;
    });
  }
  /**
   * Call the service to get the program details
   */
  private getProgramDetails(_id: string | null = null): void {
    this.programService.get(_id ?? this.id, null, null, null, null, (program) => {
      this.id = _id ?? '';
      this.program = program ?? this.program;
    });
  }

  /**
   * Calls the service to edit a new program
   * @returns void show an alert success/warning
   */
  private editProgram(): void {
    this.programService.update(this.program, (isSuccess: boolean) => {
      if (isSuccess) {
        this.onClose(true);
      }
    });
  }

  /**
   * Calls the service to create a new program
   * @returns void show an alert success/warning
   */
  private createProgram(): void {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }

    // Format the newProgram
    // TODO: find a better way to handle this
    const newProgram = {
      ...this.formData.value,
      dependencia: this.selectedDependency,
      documentos: this.program.documentos,
    };

    this.programService.create(newProgram, (_id: null | string) => {
      if(_id != null) {
        this.getProgramDetails(_id);
      }
    });
  }

  /******************************************/
  /*************** AUXILIAR *****************/
  /*****************************************/
  private createForm(): FormGroup {
    return this.formBuilder.group({
      nombre: ["", Validators.required],
      clave: ["", Validators.required],
      objetivoGeneral: ["", Validators.required],
      dependencia: ["", Validators.required],
    });
  }

  private setSubscription(): void {
    this.subscription = this.formData
      .get("dependencia")
      ?.valueChanges.subscribe((id) => {
        this.selectedDependency = this.dependencyList.filter(
          (element: any) => element._id == id
        )[0];
      });
  }

  /***********************************************/
  /****************** GETTER ********************/
  /**********************************************/
  get selectedProgramDocuments(): Array<{
    nombre: string;
    tiposDocumentos: Array<string>;
  }> {
    const especificos = this.program.modalidad?.anexos ?? [];
    const estandar = this.program?.documentos ?? [];
    return [...especificos, ...estandar];
  }

  get isShowModalidadesDisabled(): boolean {
    return this.id == "";
  }
}
