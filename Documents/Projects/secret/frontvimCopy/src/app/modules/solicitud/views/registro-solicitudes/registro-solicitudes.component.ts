import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { EncryptFunctions, RedirectionFunctions } from "@app/data/functions";
import { generateTemplateStepList } from "@app/data/constants/cedula";
import { ControlStepperRequestEventType } from "@data/types/ControlStepperRequestEventType";
import { ApplicationStorageEntity, SessionEntity } from "@app/data/entities";
import { ApplicationService, ProgramService } from "@app/data/services";
import { environment } from "@env/environment";
import swal from "sweetalert2";
@Component({
  selector: "app-registro-solicitudes",
  templateUrl: "./registro-solicitudes.component.html",
  styleUrls: ["./registro-solicitudes.component.scss"],
})
export class RegistroSolicitudesComponent implements OnInit {
  @ViewChild("curpInput") curpInput!: TemplateRef<any>;
  @ViewChild("validateCurpData") validateCurpData!: TemplateRef<any>;
  @ViewChild("tutorData") tutorData!: TemplateRef<any>;
  @ViewChild("curpSecondData") curpSecondData!: TemplateRef<any>;
  @ViewChild("contactData") contactData!: TemplateRef<any>;
  @ViewChild("shortContactData") shortContactData!: TemplateRef<any>;
  @ViewChild("cedula") cedula!: TemplateRef<any>;
  @ViewChild("uploadStepper") uploadStepper!: TemplateRef<any>;
  @ViewChild("successRegister") successRegister!: TemplateRef<any>;
  @ViewChild("additionalData") additionalData!: TemplateRef<any>;
  //
  private sessionEntity = new SessionEntity();
  private vigencia: number = this.sessionEntity.viewingYear;
  //
  private isEdit: boolean = false;
  public editFolio: string = "";
  //
  public folio = "";
  public templateStepList: Array<any> = generateTemplateStepList(
    this,
    this.vigencia
  );
  public currentStep: number = 0;
  // Controlar visibilidad de componentes
  public showCedula: boolean = false;
  public needCedula: boolean = false;
  public getTarjetaImpulso: boolean = false;
  //
  public applicationStorageEntity: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  public programData: any = {};
  public solicitudData: any = {
    tipoSolicitud: "Ciudadana",
    origen: "",
    tutor: {
      respuesta: false,
    },
  };
  public lastStepOfSharedCedula: string = "";
  private AdditionalOpion: boolean = true;
  private isBackToProgramList = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public spinner: NgxSpinnerService,
    private applicationService: ApplicationService,
    private programService: ProgramService
  ) {}

  get isCedulaStep(): boolean {
    return this.currentStep === this.templateStepList.length - 3;
  }

  ngOnInit(): void {
    this.getOrigin();
    this.getSavedData();

    this.activatedRoute.params.subscribe((params) => {
      if ("folio" in params) {
        this.applicationStorageEntity.editFolio = params.folio;
        this.isEdit = true;
        this.editFolio = params.folio;
        this.getSolicitud(params.folio, null, true);
      }
    });
  }

  ngAfterViewInit() {
    this.templateStepList = generateTemplateStepList(
      this,
      this.vigencia,
      this.programData.apoyo.datosAdicionales
    );
  }

  /*************************
   ********* EVENTS ********
   ***************************/

  public onBackToProgramList(): void {
    this.isBackToProgramList = true;
    RedirectionFunctions.redirectToProgramList(this.router);
  }

  /**
   * Handles file upload response. Save the documents in a variable, not local storage
   * @param {ControlStepperRequestEventType} event Standard request type
   */
  public onChangeFiles(event: ControlStepperRequestEventType): void {
    if (event.isNext === true) {
      this.solicitudData[event.data.name] = event.data.value.data;
      this.changeStep(event.step_action);
    } else {
      this.changeStep(event.step_action);
    }
  }

  /**
   * Handles save data response. Calls local storage
   * @param {ControlStepperRequestEventType} event Standard request type
   */
  onChangeContent(event: ControlStepperRequestEventType): void {
    if (event.isNext === true) {
      this.solicitudData[event.data.name] = event.data.value;
      if (event.data.name === "datosCurp") {
        if ("folio" in this.solicitudData.datosCurp) {
          this.solicitudData.origen = "F";
        }
        // modifies the orgin
        this.applicationStorageEntity.setNewBaseOrigin(this.solicitudData);
        // fill data
        this.solicitudData = {
          ...this.solicitudData,
          ...this.applicationStorageEntity.solicitud,
        };
      }

      this.applicationStorageEntity.solicitud = this.solicitudData;
      if (event.data.name === "datosContacto") {
        this.opcionalStep(this.AdditionalOpion);
        return;
      }
      if (event.step_action === -1) {
        // Last step
        this.opcionalStep(this.needCedula);
        return;
      }
    }

    this.changeStep(event.step_action);
  }

  onChangeContentBack(event: ControlStepperRequestEventType): void {
    window.scroll(0, 200);
    this.currentStep -= 1;
    // set variable to show last step of the other component
    this.lastStepOfSharedCedula = "last";
  }

  /**
   * Handles validate curp data. Calls local storage.
   * Checks if user has previous data
   * @param {ControlStepperRequestEventType} event Standard request type
   */
  public onValidateCurpData(event: ControlStepperRequestEventType): void {
    if (event.isNext === true) {
      this.solicitudData[event.data.name] = event.data.value;
      this.applicationStorageEntity.solicitud = this.solicitudData;
      if (this.isEdit) {
        this.changeStep(event.step_action);
      } else {
        this.getSolicitud(
          event.data.value.curp,
          event.data,
          false,
          event.step_action
        );
      }
    } else {
      this.changeStep(event.step_action);
    }
  }

  public onApplicationCreate(folio: string): void {
    if (folio !== "") {
      this.folio = folio;
      this.changeStep();
    }
  }

  public onCedulaData() {
    let encrypt_special: any = sessionStorage.getItem("control_peu");
    let decrypt_value = EncryptFunctions.decryptObj(encrypt_special);

    if (decrypt_value && decrypt_value["is_peu_special"] === true) {
      this.applicationService.createCedula({}, {}, true, (success) => {
        this.changeStep(2);
      });
    } else {
      this.changeStep();
    }
  }

  /*************************
   ******** AUXILIAR *******
   ***************************/

  private changeStep(goToStep: number = 1): void {
    window.scroll(0, 200);
    this.currentStep += goToStep;
  }

  private opcionalStep(showStep: boolean = true) {
    if (showStep) {
      this.changeStep();
    } else {
      this.changeStep(2);
    }
  }

  private getOrigin(): void {
    const encrypt_special: any = sessionStorage.getItem("control_peu");
    const decrypt_value = EncryptFunctions.decryptObj(encrypt_special);

    if (
      decrypt_value &&
      "is_peu_special" in decrypt_value &&
      decrypt_value.is_peu_special
    ) {
      this.solicitudData["origen"] = environment.PEU_SPECIAL_LETTER_ID;
    } else {
      this.solicitudData["origen"] = environment.VIM_LETTER_ID;
    }
  }

  private getSavedData(): void {
    this.programData = this.applicationStorageEntity.program;
    this.needCedula = this.programData?.modalidad?.cedula;

    if (!this.programData) {
      RedirectionFunctions.redirectToProgramList(this.router);
    }
  }

  private getTutorData(
    incomingData: { name: string; value: any } | null,
    solicitud: any
  ) {
    if (incomingData) {
      return this.solicitudData && this.solicitudData.tutor?.respuesta
        ? solicitud?.tutor
        : this.solicitudData.tutor;
    }
    return solicitud?.tutor;
  }

  private getSolicitud(
    curpFolio: string,
    incomingData: { name: string; value: any } | null,
    needSolicitante: boolean,
    stepAction: number = 1
  ): void {
    this.spinner.show();
    this.applicationService.getFormatted(
      curpFolio,
      this.needCedula,
      needSolicitante,
      (solicitud) => {
        this.solicitudData = {
          ...this.solicitudData,
          ...solicitud,
          tutor: this.getTutorData(incomingData, solicitud),
        };
        if (incomingData) {
          this.solicitudData[incomingData.name] = incomingData?.value;
        }
        this.applicationStorageEntity.originalAndCopySolicitud =
          this.cleanIncomingSolicitud(this.solicitudData);

        if (this.folio !== "") {
          this.getProgram(solicitud.programa);
          this.getApplicationCount(
            solicitud.datosCurp.curp,
            solicitud.programa.modalidad.tipoApoyo.clave,
            stepAction
          );
        } else {
          this.getApplicationCount(
            curpFolio,
            this.programData.apoyo.clave,
            stepAction
          );
        }

        
      }
    );
  }

  private getApplicationCount(
    curp: string,
    apoyo: string,
    stepAction = 1
  ): void {
    this.applicationService.getApplicationCount(
      curp,
      apoyo,
      (count: number) => {
        this.spinner.hide();
        if (count >= 0) {
          this.showApoyoAlert(count, stepAction);
        }
      }
    );
  }

  private getEditarContador(contador: number): boolean {
    return this.editFolio != null && this.editFolio !== "" && contador > 1;
  }

  private getNewContador(contador: number): boolean {
    return (
      (!this.editFolio || this.editFolio == null || this.editFolio === "") &&
      contador > 0
    );
  }

  private getIsMultiple(): boolean {
    const program = this.applicationStorageEntity.program;
    return "isMultiple" in program.apoyo ? program.apoyo.isMultiple : false;
  }

  private showApoyoAlert(contador: number, stepAction: number = 1): void {
    if (
      !this.getIsMultiple() &&
      (this.getEditarContador(contador) || this.getNewContador(contador))
    ) {
      swal
        .fire(
          "Atención!",
          "El solicitante ya cuenta con al menos un apoyo del programa.",
          "info"
        )
        .then((e) => {
          this.changeStep(-1);
        });
    } else {
      this.changeStep(stepAction);
    }
  }

  private cleanIncomingSolicitud(solicitudData: any): void {
    const cleanRes: any = {};
    for (const element of this.templateStepList) {
      if (solicitudData.hasOwnProperty(element.stepName)) {
        cleanRes[element.stepName] = solicitudData[element.stepName];
      }
    }

    this.solicitudData = {
      ...cleanRes,
      origen: this.solicitudData.origen,
      tipoSolicitud: this.solicitudData.tipoSolicitud,
    };
    return cleanRes;
  }

  private getProgram(programa: any) {
    this.spinner.show();
    this.programService.get(
      null,
      programa.q,
      programa.modalidad.clave,
      programa.modalidad.tipoApoyo.clave,
      null,
      (data) => {
        this.applicationStorageEntity.program = data;
      }
    );
  }

  public async canDeactivate(): Promise<boolean> {
    if (
      this.isBackToProgramList ||
      this.currentStep === this.templateStepList.length - 1
    )
      return true;

    const result = await swal.fire({
      title: "Atención!",
      text: "No se ha completado el registro de la solicitud",
      showDenyButton: true,
      showCancelButton: false,
      icon: "warning",
      confirmButtonText: "Descartar la solicitud",
      denyButtonText: "Continuar con el registro",
    });

    if (result.isConfirmed) {
      return true;
    }
    return false;
  }
}
