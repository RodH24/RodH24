import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PhoneValidator } from '@app/data/directives';
import { OfficeService, DependencyService, VentanillaService } from '@app/data/services';
import { Ventanilla, newVentanilla } from '@app/data/types';

@Component({
  selector: 'app-ventanilla-modal',
  templateUrl: './ventanilla-modal.component.html',
  styleUrls: ['./ventanilla-modal.component.scss'],
})
export class VentanillaModalComponent implements OnInit {
  private _ventanilla: Ventanilla = newVentanilla;
  @Input() set ventanilla(value: Ventanilla) {
    this.getOfficeList();
    this._ventanilla = value;
    this.setInitData();
  }
  get ventanilla(): Ventanilla {
    return this._ventanilla;
  }
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public pisosList: Array<string> = ['Planta Baja'];
  public dependencyList: Array<any> = [];
  public officeList: Array<any> = [];
  public formData: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private officeService: OfficeService,
    private dependencyService: DependencyService,
    private ventanillaService: VentanillaService
  ) {
    this.formData = this.createFormData();
  }

  ngOnInit(): void {
    this.setInitData();
    this.getDependencyList();
    this.dependencySubscription();
    this.cpSubscription();
  }

  get selectedDependency(): string {
    return this.formData.get('dependencia')?.value
  }

  get selectedSiglas(): string {
    const dependencia = this.dependencyList.filter((dependency) => dependency._id === this.selectedDependency)[0];
    return dependencia?.siglas ?? 'SMAOT';
  }

  /****************************
   ******** EVENTS ************
   ****************************/

  public onClose(emit: boolean = false): void {
    this.formData.reset();
    this.onCloseModal.emit(emit);
  }

  public onSave(): void {
    this.create();
    // if (this.ventanilla._id && this.ventanilla._id !== '') {
    //   this.update();
    // } else {
    //   this.create();
    // }
  }

  /****************************
  ******* DATABASE ***********
  ****************************/

  private getDependencyList(): void {
    this.dependencyService.list(false, (list) => {
      this.dependencyList = list;
    });
  }

  private getOfficeList(cp: string | null = null) {
    this.officeService.list(
      null,
      null,
      cp,
      null,
      (response: any) => {
        this.officeList = response.filter((value: any, index: any) => { return response.map(function (e: any) { return e._id; }).indexOf(value._id) === index; });
      }
    );
  }

  private create(): void {
    const formData = this.formData.value;
    this.ventanillaService.create(
      formData.oficina,
      {
        clave: formData.clave,
        telefono: formData.telefono
      },
      (isSuccess) => {
        if (isSuccess) {
          this.onClose(isSuccess);
        }
      });
  }

  /****************************
   ******* AUXILIAR ***********
   ****************************/

  private createFormData(): UntypedFormGroup {
    return this.formBuilder.group({
      dependencia: ['', [Validators.required]],
      cp: [{ value: '', disabled: true }, [Validators.maxLength(5), Validators.minLength(5)]],
      oficina: [{ value: '', disabled: true }, [Validators.required]],
      clave: [{ value: '', disabled: true }, [Validators.required]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          PhoneValidator(),
        ],
      ],
    });
  }

  private setInitData(): void {
    this.formData.patchValue({
      dependencia: this.ventanilla.dependencia,
      cp: '',
      oficina: this.ventanilla._id,
      clave: this.ventanilla.clave,
      telefono: this.ventanilla.contacto.telefono
    })
    // if ('piso' in this.ventanilla) {
    //   this.formData.patchValue(this.ventanilla);
    // }
  }

  private setValidationDependencyList(): void {
    this.formData?.get('clave')?.setValidators([Validators.required, Validators.pattern(`^${this.selectedSiglas}-[0-9][0-9][0-9]`)]);
  }

  private cpSubscription(): void {
    this.formData.get('cp')?.valueChanges.subscribe(input => {
      const cpValue = this.formData.get('cp')?.value ? this.formData.get('cp')?.value.toString() : '';
      if (this.formData.get('cp')?.valid && cpValue.length === 5) {
        this.getOfficeList(input);
      }
    });
  }

  private dependencySubscription(): void {
    this.formData.get('dependencia')?.valueChanges.subscribe(selectedDependency => {
      if (selectedDependency && selectedDependency.length) {
        this.formData.get('oficina')?.enable();
        this.formData.get('clave')?.enable();
        this.formData.get('cp')?.enable();
        this.setValidationDependencyList()
      } else {
        this.formData.get('oficina')?.disable();
        this.formData.get('clave')?.disable();
        this.formData.get('cp')?.disable();
      }
    });
  }
}

