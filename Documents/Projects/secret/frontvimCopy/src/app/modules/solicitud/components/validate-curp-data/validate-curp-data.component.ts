import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import {
  CurrencyFunctions,
  FormFunctions,
  SolicitudFunctions,
} from "@app/data/functions";
import { getStepConfiguration } from "@app/data/constants/cedula";
import { CurpType } from "@data/types/CurpType";
import { ProgramType, NewProgram } from "@app/data/types";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { SessionEntity, ApplicationStorageEntity } from "@app/data/entities";
import { CurrencyInputPipe } from "@core/pipes";
import { Subscription } from "rxjs";
import * as moment from "moment";
import { redirectToProgramList } from "@app/data/functions/redirections";
import { Router } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "validate-curp-data",
  templateUrl: "./validate-curp-data.component.html",
  styleUrls: ["./validate-curp-data.component.scss"],
  providers: [CurrencyInputPipe],
})
export class ValidateCurpDataComponent implements OnInit {
  @Input() inputData!: any;
  @Input() programData: ProgramType = NewProgram;
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  //
  private sessionEntity = new SessionEntity();
  private vigencia: number = this.sessionEntity.viewingYear;
  private stepName: string = "datosCurp";
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  //
  public isCuneros = this.programData.modalidad?.clave.includes("QC3807");
  public isEdit: boolean = this.applicationStorage.editFolio !== "";
  public curpData!: CurpType;
  public formData: UntypedFormGroup | any = {};
  public descripcion: string = "";
  public costoAproximado: any;
  public rfc: string = "";
  public fechaCaptura: any = new Date();
  public isAdult: boolean = true;
  public isValid: boolean = true;
  public smaotFolio: string = "";
  public stepConfig: any = getStepConfiguration(this.stepName, this.vigencia);
  public diferentVigencia: boolean = false;
  public showInfanteModal: boolean = false;
  public modalMsg: string =
    "El solicitante es mayor a la edad establecida en el programa.";
  //
  formattedAmount: any = "";
  private subscription: Subscription | undefined;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router) {
    this.getStepConfig();
    if (this.stepConfig) {
      this.formData = this.formBuilder.group(this.stepConfig.form);
      this.diferentVigencia =
        moment().utc().year() !== this.stepConfig.vigencia;
      if (this.diferentVigencia) {
        this.fechaCaptura = moment(this.stepConfig.vigencia.toString())
          .utc()
          .toDate();
      }
    } else {
      redirectToProgramList(this.router);
      return;
    }

    this.subscription = FormFunctions.setCurrencyInputSubscription(
      this.formData,
      "costoAproximado"
    );
  }

  private getStepConfig(): void {
    if (this.stepConfig) {
      return;
    } else {
      this.stepConfig = getStepConfiguration(this.stepName, this.vigencia);
    }
  }

  ngOnInit(): void {
    this.isCuneros = this.programData.modalidad?.clave.includes("QC3807");
    window.scroll(0, 200);
    this.isAdult = SolicitudFunctions.isAdult(
      this.inputData.datosCurp.fechaNacimientoTexto
    );
    this.setinitData();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public onNext() {
    this.nextStep();
  }

  public previousStep(): void {
    this.changeContent.emit(SolicitudFunctions.previousStep());
  }

  private nextStep(): void {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }

    if (
      this.isCuneros &&
      SolicitudFunctions.getAge(this.inputData.datosCurp.fechaNacimientoTexto) >
        1
    ) {
      swal
        .fire(
          "Atención!",
          "El solicitante es mayor a la edad establecida en el programa.",
          "info"
        )
        .then((e) => {
          this.previousStep();
        });
    } else {
      this.emitSteps();
    }
    //
  }

  private emitSteps(): void {
    const needTutor =
      this.isEdit && this.isCuneros
        ? true
        : this.formData.get("needTutor")?.value;
    // QC3807
    let step = 1; // Adultos que necesitan tutor y menor de edad
    if (!needTutor) {
      step = 2;
    }

    if (
      needTutor &&
      "tutor" in this.inputData &&
      "datosGenerales" in this.inputData.tutor
    ) {
      // conservar el original
    } else {
      this.inputData = {
        // se hizo asi porque no se actualiza de otra forma
        ...this.inputData,
        tutor: {
          respuesta: needTutor,
        },
      };
    }
    this.curpData.descripcion = this.formData.get("descripcion")?.value;
    this.curpData.costoAproximado = CurrencyFunctions.priceToNumber(
      this.formData.get("costoAproximado")?.value
    );
    this.curpData.fechaCaptura = moment(this.fechaCaptura).toISOString();
    this.curpData.comentarioSolicitud = this.formData.get(
      "comentarioSolicitud"
    )?.value;

    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.curpData, step)
    );
  }

  private setinitData(): void {
    let needTutor = this.isCuneros;
    if (
      "tutor" in this.inputData &&
      "respuesta" in this.inputData.tutor &&
      this.inputData.tutor.respuesta
    ) {
      needTutor = true;
    }
    if (!needTutor) {
      this.inputData.tutor = {
        respuesta: false,
      };
    }
    this.curpData = this.inputData.datosCurp;
    this.formData.get("needTutor")?.setValue(needTutor);
    this.formData
      .get("costoAproximado")
      ?.setValue(this.curpData.costoAproximado ?? 0.0);
    this.formData.get("descripcion")?.setValue(this.curpData.descripcion ?? "");
    this.formData
      .get("comentarioSolicitud")
      ?.setValue(this.curpData.comentarioSolicitud ?? "");
  }
}
