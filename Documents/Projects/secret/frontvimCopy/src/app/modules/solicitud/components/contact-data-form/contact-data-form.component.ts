import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AddressFormList, ContactNumberTypeList, EmailProvider } from '@data/constants/cedula';
import { AddressFormType } from '@data/types/AddressFormType';
import { ControlStepperRequestEventType } from '@data/types/ControlStepperRequestEventType';
import { CatalogService, UtilsService } from '@data/services';
import { ProgramType, NewProgram } from '@app/data/types';
import { EmailUserValidator, PhoneValidator } from '@app/data/directives';
import { ToastrService } from 'ngx-toastr';
import { FormFunctions, SolicitudFunctions } from '@app/data/functions';
import { NgxSpinnerService } from "ngx-spinner";
import { getStepConfiguration } from '@app/data/constants/cedula';
import { SessionEntity, ApplicationStorageEntity } from '@app/data/entities';
import { listaOcupacion, listaOfOption } from '@app/data/constants/cedula';
@Component({
  selector: 'app-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.scss'],
})
export class ContactDataFormComponent implements OnInit {
  @ViewChild('IdPrintAreaCard') print_area_card!: ElementRef;
  @Input() inputData!: any;
  @Input() programData: ProgramType = NewProgram;
  @Output() changeContent: EventEmitter<ControlStepperRequestEventType> = new EventEmitter<ControlStepperRequestEventType>();
  //
  private sessionEntity = new SessionEntity();
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  public vigencia: number = this.sessionEntity.viewingYear;
  //
  public readonly contactNumberTypeList: Array<string> = ContactNumberTypeList;
  public readonly addressFormList: Array<AddressFormType> = AddressFormList;
  public emailProvider: Array<string> = EmailProvider;
  private stepName: string = 'datosContacto';
  public formData: UntypedFormGroup = this.formBuilder.group({});
  public formEmail: UntypedFormGroup;
  public neighborhoodsList: Array<{ nombre: string; tipo: string }> = [];
  public isLoadingCpData: boolean = false;
  public curpData!: any;
  public hasTarjetaImpulso: boolean = false;
  public isAddressByCoordinates: boolean = false;
  public isOpenModal: boolean = false;
  public map: any;
  public pointMarker: any;
  public enable_btn: boolean = false;
  public confirmAddress: boolean = false; // mor_todo change to false
  public dataResponse: any;
  //
  public stepConfig = getStepConfiguration(this.stepName, this.vigencia);
  public showEstadoSelect: boolean = false;
  public estadoList: Array<string> = [];
  public estadosFullList: Array<any> = [];
  public municipioList: Array<any> = [];
  public selectedEstado: string = "";


  public listOfOption = listaOfOption;

  public listOfSelectedValue: Array<any> = [{
    respuesta: false,
    codigo: 2,
    descripcion: "Afromexicano(a)",
  },];

  public listOcupacion: Array<any> = listaOcupacion;

  get entidadFederativa() {
    return this.formData.get('entidadFederativa')?.value;
  }

  get nombreCurp() {
    const nombre = this.curpData?.nombre ? this.curpData?.nombre : '';
    const primerApellido = this.curpData?.primerApellido
      ? this.curpData?.primerApellido
      : '';
    const segundoApellido = this.curpData?.segundoApellido
      ? this.curpData?.segundoApellido
      : '';

    return nombre + primerApellido + segundoApellido;
  }

  get tarjetaImpulso() {
    return this.formData.get('solicitudImpulso')?.value;
  }

  /** Get form array of formData telefonos field */
  get telefono(): UntypedFormArray {
    const telefonos = this.formData.get('telefonos');
    return (telefonos ? telefonos : []) as UntypedFormArray;
  }

  /** Add a new item in telefonos FormArray */
  set telefono(value: any) {
    const telefonos = this.formData.get('telefonos') as UntypedFormArray;
    telefonos.push(this.createTelefonoFormGroup(value));
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private catalogService: CatalogService,
  ) {
    this.setFormDataByCondition();
    this.formEmail = this.formBuilder.group({
      user: ['', [EmailUserValidator()]],
      domain: ['gmail.com', []],
    });

    if (this.stepConfig.show.estadoSelect) {
      this.formData.get('entidadFederativa')
        ?.valueChanges
        .subscribe((value: any) => {
          this.municipioList = this.estadosFullList.filter((element: any) =>
            element.estado.toUpperCase() === value.toUpperCase())[0]?.municipios;

          if (value.toUpperCase() === this.inputData[this.stepName]?.entidadFederativa.toUpperCase()) {
            this.formData.controls['municipio'].setValue(this.inputData[this.stepName]?.municipio ?? '');
          } else {
            this.formData.get('municipio')?.setValue('');
          }
        });
    }
  }

  ngOnInit(): void {
    this.setFormValue();
  }

  /*******************************
   ********** EVENTS **************
   ********************************/
  public onAddProvider(input: HTMLInputElement): void {
    const value = input.value;
    if (this.emailProvider.indexOf(value) === -1) {
      this.emailProvider = [...this.emailProvider, input.value];
    }
  }

  public onAddressChange(): void {
    this.setFormDataByCondition();
    this.setFormValue();
  }

  public onGetCpData(event: any): void {
    let inputCp = event.target.value;
    const reg = /^\d{4,5}$/;

    if (
      (!isNaN(+inputCp) && reg.test(inputCp)) ||
      inputCp === '' ||
      inputCp === '-'
    ) {
      if (event.target.value.length == 5) {
        this.getCpData(inputCp);
      }
    }
  }

  /**
   * Adds a new phone field in the telefonos form array
   * @param {MouseEvent} e
   */
  public onAddPhone(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    this.telefono = { descripcion: '', tipo: '' };
  }

  public onRemovePhone(i: number, e: MouseEvent): void {
    e.preventDefault();
    const telefonos = this.formData.get('telefonos') as UntypedFormArray;
    if (telefonos.length > 1) {
      telefonos.removeAt(i);
    } else {
      telefonos.reset();
    }
  }

  public onPreviousStepClick() {
    if(this.inputData.tutor.respuesta){
      this.changeContent.emit(SolicitudFunctions.previousStep(-1));
    }else{
      this.changeContent.emit(SolicitudFunctions.previousStep(-2));
    }
  }

  public onNextStepClick() {
    const selectedOcupacion = listaOcupacion.filter(element => element.codigo === parseInt(this.formData.get('ocupacion.codigo')?.value))[0]
    this.formData.get('ocupacion.descripcion')?.setValue(selectedOcupacion?.descripcion)

    if (this.showEstadoSelect) {
      this.formData.get('asentamiento.tipo')?.setValue('ewe');
    }

    if (!FormFunctions.showFormErrors(this.formData) || !this.validateData()) {
      return;
    }

    if (!this.stepConfig.show.validateCp) {
      this.setFormatedPoblacionVulnerable();
      this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
      return;
    }
    // validates if exists coordenadas key on formdata 
    if ('coordenadas' in this.formData.value) {
      this.setFormatedPoblacionVulnerable()
      this.changeContent.emit(
        SolicitudFunctions.nexStep(this.stepName, this.formData.value, -1)
      );
      return;
    }
    else {
      this.spinner.show();
      this.validateCPdata()
    }
  }

  /*******************************
   ********** DATABASE ************
   ********************************/
  private getCpData(cp: string): void {
    this.isLoadingCpData = true;
    this.utilsService.getSolicitudCpData(cp, (data) => {
      this.showEstadoSelect = false;
      if (data) {
        this.neighborhoodsList = data.neighborhoodList;
        this.setSubscription();
        this.formData.get('asentamiento')?.setValue(
          this.inputData[this.stepName]?.asentamiento ?? {
            tipo: '',
            nombre: '',
          }
        );
        this.formData.controls['entidadFederativa'].setValue(data.state);
        this.formData.controls['municipio'].setValue(data.municipality);
      } else if (!data && this.stepConfig.show.estadoSelect) {
        this.showEstadoSelect = true;
        this.setEstadoSelectInputData();
        this.catalogService.getMunicipioList(null, (list: any) => {
          this.estadoList = list.map((element: any) => element.estado);
          this.estadosFullList = list;
          this.formData.controls['entidadFederativa'].setValue(this.inputData[this.stepName]?.entidadFederativa ?? '');
        });
      }
      this.isLoadingCpData = false;
    });
  }

  private setEstadoSelectInputData(): void {
    this.toastr.info('Ingrese manualmente su dirección');
    this.formData.controls['asentamiento'].setValue({
      tipo: 'ewe',
      nombre: this.inputData[this.stepName]?.asentamiento?.nombre ?? '',
    });
    this.formData.controls['localidad'].setValue(this.inputData[this.stepName]?.localidad ?? '');
  }

  public changeStepEvent(newFormData: any) {
    this.confirmAddress = false;
    this.formData = newFormData;
    this.setFormatedPoblacionVulnerable()
    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.formData.value, -1)
    );
  }

  public closeModalEvent(even: any) {
    this.confirmAddress = !this.confirmAddress;
  }

  public validateCPdata() {
    // enable btn 
    this.enable_btn = true;

    let bodyStringify = {
      datosContacto: {
        cp: this.formData.value.cp,
        asentamiento: this.formData.value.asentamiento,
        numeroExt: this.formData.value.numeroExt,
        numeroInt: this.formData.value.numeroInt,
        entidadFederativa: this.formData.value.entidadFederativa,
        municipio: this.formData.value.municipio,
        calle: this.formData.value.calle
      }
    };

    if (!this.stepConfig.show.validateCp) {
      this.setFormatedPoblacionVulnerable()
      this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
    } else {
      this.utilsService.getCPvalidationData(bodyStringify, (data) => {
        if (data?.value === true) {
          this.spinner.hide();
          this.setFormatedPoblacionVulnerable()
          this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
          // save data 
        } else {
          this.spinner.hide();
          // Info doesnt match to show modal

          // validate if entered CP is equal to AGEB response 
          if (data?.data?.sdsh?.result[6] === data?.data?.zipCodes?.contactData) {
            this.spinner.hide();
            this.setFormatedPoblacionVulnerable()
            this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
          } else {
            // view modal for confirm address
            this.confirmAddress = !this.confirmAddress;
            this.dataResponse = data;
          }
        }
        this.isLoadingCpData = false;
      });
    }
  }

  /*******************************
   ********** AUXILIAR ************
   ********************************/
  private validateData(): boolean {
    if (this.formEmail.get('user')?.value !== '') {
      if (this.formEmail.get('user')?.valid) {
        const completeEmail = `${this.formEmail.get('user')?.value}@${this.formEmail.get('domain')?.value
          }`;
        this.formData
          .get('correos')
          ?.patchValue([{ tipo: 'personal', descripcion: completeEmail }]);
      } else {
        this.toastr.warning(
          'Por favor, introduce una direccioón de correo válida'
        );
        return false;
      }
    }
    return true;
  }

  private createTelefonoFormGroup(value: {
    descripcion: string;
    tipo: string;
  }): any {
    return this.formBuilder.group({
      descripcion: [value.descripcion, [Validators.required, PhoneValidator()]],
      tipo: [value.tipo, [Validators.required]],
    });
  }

  private setFormDataByCondition(): void {
    this.formData = this.formDataByCondition;
    if (!this.isAddressByCoordinates) {
      this.setSubscription();
    }
  }

  private setSubscription(): void {
    FormFunctions.setSelectSubscription(
      this.formData,
      'asentamiento',
      this.neighborhoodsList,
      ['tipo'],
      'nombre'
    )
  }

  get formDataByCondition(): UntypedFormGroup {
    const coordinates = {
      solicitudImpulso: [true, []],
      autorizaContacto: [false, []],
      entidadFederativa: ['', [Validators.required]],
      numeroExt: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      coordenadas: new UntypedFormArray([
        new UntypedFormControl('', [
          Validators.required,
          Validators.min(-90),
          Validators.max(90),
        ]), // -90, 90
        new UntypedFormControl('', [
          Validators.required,
          Validators.min(-180),
          Validators.max(180),
        ]), //-180, 180
      ]),
    };
    const cp = {
      cp: ['', [Validators.required]],
      asentamiento: this.formBuilder.group({
        tipo: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
      }),
      numeroExt: ['', [Validators.required]],
      numeroInt: [''],
      entidadFederativa: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      localidad: ['', [...(this.stepConfig.show.localidadInput ? [Validators.required] : [])]],
      calle: ['', [Validators.required]],
      referencias: ['', []],
      solicitudImpulso: [true, []],
      autorizaContacto: [false, []],
      poblacionVulnerable: [[], []],
      ocupacion: this.formBuilder.group({
        codigo: [0, []],
        descripcion: ['', []],
      }),
    };

    return (this.formData = this.formBuilder.group({
      consentimiento: [true, [Validators.required]],
      telefonos: new UntypedFormArray([
        this.formBuilder.group({
          descripcion: ['', [Validators.required, PhoneValidator()]],
          tipo: ['', [Validators.required]],
        }),
      ]),
      correos: new UntypedFormArray([
        this.formBuilder.group({
          tipo: ['personal'],
          descripcion: ['', [Validators.email]],
        }),
      ]),
      ...(this.isAddressByCoordinates ? coordinates : cp),
    }));
  }

  private setFormValue(): void {
    this.curpData = this.inputData.datosCurp;
    if (
      this.curpData &&
      'folioImpulso' in this.curpData &&
      this.curpData['folioImpulso']?.length > 0
    ) {
      this.hasTarjetaImpulso = true;
    }
    if (
      this.inputData &&
      this.stepName in this.inputData &&
      this.inputData[this.stepName]
    ) {
      this.inputData[this.stepName]['solicitudImpulso'] = false;
      this.inputData[this.stepName]['autorizaContacto'] = false;

      this.formData.patchValue(this.inputData[this.stepName]);
      this.setPoblacionVulnerableFromInput();
      this.setTelefonosFromInput();
      this.setCorreosFromInput();
      if (!this.isAddressByCoordinates) {
        this.getCpData(this.inputData[this.stepName].cp);
      }
    }
  }

  private setPoblacionVulnerableFromInput(): void {
    const formated = [];
    const poblacionVulnerable = this.inputData[this.stepName].poblacionVulnerable;
    if (poblacionVulnerable) {
      for(const element of poblacionVulnerable) {
        if (typeof element !== 'number' && element.respuesta) {
          formated.push(element.codigo)
        } else {
          formated.push(element)
        }
      }
      // delete this.inputData[this.stepName].poblacionVulnerable;
      this.formData.get('poblacionVulnerable')?.setValue(formated);
    }
  }

  private setTelefonosFromInput(): void {
    let i = 0;
    for (const element of this.inputData[this.stepName].telefonos) {
      if (i !== 0) {
        this.telefono = element;
      }
      i++;
    }
  }

  private setCorreosFromInput(): void {
    this.formEmail.patchValue(this.inputData.correoSeparado);
    let correoTmp: string = "";
    for(let item of this.formData.get('correos')?.value){
      if(item){
        correoTmp = item.descripcion;
      }
    }
    let correoDividido = correoTmp.split("@");
    let antesArroba = correoDividido[0];
    let despuesArroba = correoDividido[1];
    this.formEmail.get('user')?.setValue(antesArroba);
    this.formEmail.get('domain')?.setValue(despuesArroba);
  }


  private selecPoblacionVulnerable(poblacionVulnerable: Array<any>) {
    // poblacionVulnerable: []
    const selected = [];
    if (poblacionVulnerable) {
      for (let item of listaOfOption) {
        selected.push({
          respuesta: poblacionVulnerable.includes(item.codigo),
          codigo: item.codigo,
          descripcion: item.descripcion
        })
      }
    }
    return selected;
  }

  private setFormatedPoblacionVulnerable() {
    this.formData.get('poblacionVulnerable')?.setValue(this.selecPoblacionVulnerable(this.formData.get('poblacionVulnerable')?.value));
    const original = this.applicationStorage.originalSolicitud;
    if(original[this.stepName] && original[this.stepName].poblacionVulnerable) {
      original[this.stepName].poblacionVulnerable = this.selecPoblacionVulnerable(original[this.stepName]?.poblacionVulnerable ?? [])
      this.applicationStorage.originalSolicitud = original;
    }    
  }
}

