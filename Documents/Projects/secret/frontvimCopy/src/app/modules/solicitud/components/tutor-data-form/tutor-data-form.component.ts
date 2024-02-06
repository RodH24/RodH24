import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ControlStepperRequestEventType, SelectOptionType } from "@data/types";
import {
  EmailUserValidator,
  CurpValidator,
  PhoneValidator,
} from "@app/data/directives";
import { UtilsService } from "@app/data/services";
import { Tutor } from "@data/constants/cedula";

import {
  AddressFormList,
  ContactNumberTypeList,
  EmailProvider,
} from "@app/data/constants/cedula";
import { AddressFormType } from "@app/data/types/AddressFormType";
import {
  FormFunctions,
  SolicitudFunctions,
} from "@app/data/functions";
import { ApplicationStorageEntity } from "@app/data/entities";

@Component({
  selector: "tutor-data-form",
  templateUrl: "./tutor-data-form.component.html",
  styleUrls: ["./tutor-data-form.component.scss"],
})
export class TutorDataFormComponent implements OnInit {
  @Output() changeContent: EventEmitter<ControlStepperRequestEventType> =
    new EventEmitter();
  //
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  public readonly relationshipCatalog: Array<SelectOptionType> = Tutor;
  public contactNumberTypeList: Array<string> = ContactNumberTypeList;
  public addressFormList: Array<AddressFormType> = AddressFormList;
  public emailProvider: Array<string> = EmailProvider;

  //
  public stepName: string = "tutor";
  public formData: UntypedFormGroup;
  public formEmail: UntypedFormGroup;

  get isAdult(): boolean {
    return SolicitudFunctions.isAdult(
      this.formData.get("datosGenerales.fechaNacimientoTexto")?.value
    );
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService
  ) {
    this.formData = this.formBuilder.group({
      respuesta: [true, [Validators.required]],
      datosGenerales: this.formBuilder.group({
        curp: [
          "",
          [
            Validators.required,
            Validators.minLength(18),
            Validators.maxLength(18),
            CurpValidator(),
          ],
        ],
        parentesco: this.formBuilder.group({
          codigo: [0, [Validators.required, Validators.min(1)]],
          descripcion: ["", [Validators.required]],
        }),
        nombre: [{ value: "", disabled: true }],
        primerApellido: [{ value: "", disabled: true }],
        segundoApellido: [{ value: "", disabled: true }],
        genero: [{ value: "", disabled: true }],
        fechaNacimientoTexto: [{ value: "", disabled: true }],
        fechaNacimientoDate: [{ value: "", disabled: true }],
        entidadNacimiento: [{ value: "", disabled: true }],
        nacionalidad: [{ value: "", disabled: true }],
        telefono: this.formBuilder.group({
          descripcion: ["", [Validators.required, PhoneValidator()]],
          tipo: ["", [Validators.required]],
        }),
        correo: this.formBuilder.group({
          tipo: ["personal"],
          descripcion: ["", [Validators.email]],
        }),
      }),
    });

    this.formEmail = this.formBuilder.group({
      user: ["", [EmailUserValidator()]],
      domain: ["gmail.com", []],
    });
  }

  ngOnInit(): void {
    FormFunctions.setSelectSubscription(
      this.formData,
      "datosGenerales.parentesco",
      this.relationshipCatalog,
      ["descripcion"]
    );

    this.setInitData();
  }

  private setCorreosFromInputt(): void {
    let correoTmp: string = this.formData.get(
      "datosGenerales.correo.descripcion"
    )?.value;
    let correoDividido = correoTmp.split("@");
    let antesArroba = correoDividido[0];
    let despuesArroba = correoDividido[1];
    this.formEmail.get("user")?.setValue(antesArroba);
    this.formEmail.get("domain")?.setValue(despuesArroba);
  }

  public validatePreviusCurp(new_curp: string): boolean {
    if (this.applicationStorage.curp == new_curp) {
      return true;
    } else {
      return false;
    }
  }

  /*******************************
   ********** EVENTS **************
   ********************************/
  public onCurpChange(): void {
    if (!this.formData.get("datosGenerales.curp")?.invalid) {
      let validate_curp = this.validatePreviusCurp(
        this.formData.get("datosGenerales.curp")?.value
      );

      if (validate_curp === true) {
        this.toastr.warning("No puedes utilizar el mismo CURP");
      } else {
        this.spinner.show();
        this.utilsService.getCurpData(
          this.formData.get("datosGenerales.curp")?.value,
          (data) => {
            this.spinner.hide();
            if (data) {
              this.formData.get("datosGenerales")?.patchValue({
                nombre: data.nombre,
                primerApellido: data.primerApellido,
                segundoApellido: data.segundoApellido,
                fechaNacimientoDate: data.fechaNacimientoDate,
                fechaNacimientoTexto: data.fechaNacimientoTexto,
                entidadNacimiento: data.entidadNacimiento,
                genero: data.genero,
                nacionalidad: data.nacionalidad,
                anioRegistro: data.anioRegistro,
              });
            }
          }
        );
      }
    }
  }

  public onAddProvider(input: HTMLInputElement): void {
    const value = input.value;
    if (this.emailProvider.indexOf(value) === -1) {
      this.emailProvider = [...this.emailProvider, input.value];
    }
  }

  public previousStep() {
    this.changeContent.emit(SolicitudFunctions.previousStep());
  }

  public nextStep(): void {
    if (!FormFunctions.showFormErrors(this.formData) || !this.validateData()) {
      return;
    }
    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.formData.getRawValue())
    );
  }

  /*******************************
   ********** AUXILIAR ************
   ********************************/
  private validateData(): boolean {
    if (this.formEmail.get("user")?.value !== "") {
      if (this.formEmail.get("user")?.valid) {
        const completeEmail = `${this.formEmail.get("user")?.value}@${
          this.formEmail.get("domain")?.value
        }`;
        this.formData
          .get("datosGenerales.correo")
          ?.setValue({ tipo: "personal", descripcion: completeEmail });
      } else {
        this.toastr.warning(
          "Por favor, introduce una direccioón de correo válida"
        );
        return false;
      }
    }
    return true;
  }

  private setInitData(): void {
    if (
      this.applicationStorage.solicitud?.[this.stepName] &&
      this.applicationStorage.solicitud?.[this.stepName].respuesta
    ) {
      this.formData
        .get("datosGenerales")
        ?.patchValue(
          this.applicationStorage.solicitud[this.stepName].datosGenerales
        );
      this.setCorreosFromInputt();
    } else if ("tutorCurp" in this.applicationStorage.solicitud) {
      this.formData
        .get("datosGenerales.curp")
        ?.setValue(this.applicationStorage.solicitud.tutorCurp);
      this.onCurpChange();
    }
  }
}
