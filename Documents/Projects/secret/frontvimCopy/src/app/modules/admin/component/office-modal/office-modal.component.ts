import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PhoneValidator } from '@app/data/directives';
import { OfficeService, UtilsService } from '@app/data/services';
import { newVentanilla, Ventanilla } from '@app/data/types';

@Component({
  selector: 'app-office-modal',
  templateUrl: './office-modal.component.html',
  styleUrls: ['./office-modal.component.scss'],
})
export class OfficeModalComponent implements OnInit {
  @Input() office: Ventanilla = newVentanilla;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public formData: UntypedFormGroup;
  // Informacion para mostrar
  public neighborhoodsList: Array<any> = [];
  public isLoadingCpData = false;
  public tituloModalOficina :string="";
  public disableGuardarButton: boolean = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private officeService: OfficeService,
    private utilsServide: UtilsService
  ) {
    this.formData = this.formBuilder.group({
      clave:['', [Validators.required, Validators.minLength(4)]],
      descripcion: ['', [Validators.required]],
      contacto: this.formBuilder.group({
        telefono: ['', [Validators.required, Validators.minLength(10),
          Validators.maxLength(10), PhoneValidator()]],
      }),
      domicilio: this.formBuilder.group({
        cp: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        ],
        entidadFederativa: [
          { value: '', disabled: true },
          [Validators.required],
        ],
        nombreMunicipio: [{ value: '', disabled: true }, [Validators.required]],
        colonia: ['', [Validators.required]],
        calle: ['', [Validators.required]],
        numeroExt: ['', [Validators.required]],
        numeroInt: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.setInitData();
    this.tituloModalOficina= "Crear Oficina";
    if(this.office._id && this.office._id !== ''){
      this.tituloModalOficina= "Editar Oficina";
      this.formData?.get('clave')?.disable();
    }
  }

  private setInitData(): void {
    if (this.office._id && this.office._id !== '') {
      this.formData.get('descripcion')?.setValue(this.office.descripcion);
      this.formData.get('clave')?.setValue(this.office.clave);
      this.formData.get('contacto.telefono')?.setValue(this.office.contacto?.telefono);
      this.formData.get('domicilio.cp')?.setValue(this.office.domicilio.codigoPostal);
      this.formData.get('domicilio.calle')?.setValue(this.office.domicilio.calle);
      this.formData.get('domicilio.numeroExt')?.setValue(this.office.domicilio.numeroExterior);
      this.formData.get('domicilio.numeroInt')?.setValue(this.office.domicilio.numeroInterior);
      this.getCpData(this.office.domicilio.codigoPostal);
    }

    const fieldList: Array<string> = [
      'colonia',
      'calle',
      'numeroExt',
      'numeroInt',
    ];
    for (const element of fieldList) {
      const domicilio = this.office.domicilio;
      const key = element as keyof typeof domicilio;
      this.formData.get(element)?.setValue(domicilio[key]);
    }
  }

  /****************************
   ******** EVENTS ************
   ****************************/

  public onGetCpData(event: any): void {
    let inputCp = event.target.value;
    const reg = /^(3[6-8])([0-9]{3})$/;
    if (
      event.target.value.length == 5 &&
      ((!isNaN(+inputCp) && reg.test(inputCp)) ||
        inputCp === '' ||
        inputCp === '-')
    ) {
      this.getCpData(inputCp);
    }
  }

  public onSaveData(): void {
    this.disableGuardarButton=true;
    if (this.office._id && this.office._id !== '') {
      this.updateOffice();
    } else {
      this.createOffice();
    }
  }


  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

  /****************************
   ******* DATABASE ***********
   ****************************/

  private getCpData(cp: string): void {
    const _this = this;
    this.isLoadingCpData = true;
    this.utilsServide.getCpData(cp, (data) => {
      if (data) {
        this.neighborhoodsList = data.neighborhoodList;
        _this.formData
          .get('domicilio.colonia')
          ?.setValue(this.office.domicilio.colonia ?? '');
        _this.formData.get('domicilio.entidadFederativa')?.patchValue(data.state);
        _this.formData.get('domicilio.nombreMunicipio')?.patchValue(data.municipality);
      }
      this.isLoadingCpData = false;
    });
  }

  private createOffice(): void {
    this.officeService.createOffice(this.formData.getRawValue(), (isSuccess) => {
      if (isSuccess) {
        this.onClose(true);
      }
    });
  }

  private updateOffice(): void {
    this.officeService.updateOffice(this.office._id, this.office.clave, this.formData.getRawValue(), (isSuccess) => {
      if (isSuccess) {
        this.onClose(true);
      }
    });
  }
}
