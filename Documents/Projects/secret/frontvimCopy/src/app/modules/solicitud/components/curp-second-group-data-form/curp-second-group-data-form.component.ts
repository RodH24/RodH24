import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConditionalValidator } from '@app/data/directives';
import { ApplicationStorageEntity } from '@app/data/entities';
import { FormFunctions, SolicitudFunctions } from '@app/data/functions';
import { SelectOptionType } from '@app/data/types';
import { CivilState, Relationship, Migrant } from '@data/constants/cedula';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-curp-second-group-data-form',
  templateUrl: './curp-second-group-data-form.component.html',
  styleUrls: ['./curp-second-group-data-form.component.scss'],
})
export class CurpSecondGroupDataFormComponent implements OnInit {
  @Input() inputData!: any;
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  private stepName: string = 'datosComplementarios';
  public readonly civilStateCatalog: Array<string> = CivilState;
  public readonly relationshipCatalog: Array<SelectOptionType> = Relationship;
  public readonly migrantCatalog: Array<SelectOptionType> = Migrant;
  public formData: UntypedFormGroup;

  get isValidHijos(): boolean {
    const hombres = this.formData.get('tieneHijos.descripcion.hombres')?.value;
    const mujeres = this.formData.get('tieneHijos.descripcion.mujeres')?.value;

    if (this.formData.get('tieneHijos.respuesta')?.value) {
      return (
        this.formData.get('tieneHijos.respuesta')?.value &&
        mujeres + hombres > 0 &&
        hombres + mujeres < 70
      );
    }
    return true;
  }

  /**
   * Generate the form group.
   * Fields with conditional validators only are required when the response is true
   * @constructor
   * @param formBuilder
   */
  constructor(private formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
    this.formData = this.formBuilder.group({
      estadoCivil: ['', [Validators.required]],
      parentescoJefeHogar: this.formBuilder.group({
        codigo: [0, [Validators.required, Validators.min(1)]],
        descripcion: ['', [Validators.required]],
      }),
      migrante: this.formBuilder.group({
        respuesta: [false, [Validators.required]],
        codigo: [0, [Validators.required, Validators.min(0)]],
        descripcion: ['Ninguna de las anteriores', [Validators.required]],
      }),
      afroMexicano: [false, [Validators.required]],
      comunidadIndigena: this.formBuilder.group({
        respuesta: [false],
        codigo: [0],
        descripcion: [
          '',
          [
            ConditionalValidator(
              () => this.formData.get('comunidadIndigena.respuesta')?.value
            ),
          ],
        ],
      }),
      hablaDialecto: this.formBuilder.group({
        respuesta: [false],
        codigo: [0],
        descripcion: [
          '',
          [
            ConditionalValidator(
              () => this.formData.get('hablaDialecto.respuesta')?.value
            ),
          ],
        ],
      }),
      tieneHijos: this.formBuilder.group({
        respuesta: [false],
        descripcion: this.formBuilder.group({
          hombres: [
            0,
            [
              ConditionalValidator(
                () => this.formData.get('tieneHijos.respuesta')?.value,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.max(70),
                ]
              ),
            ],
          ],
          mujeres: [
            0,
            [
              ConditionalValidator(
                () => this.formData.get('tieneHijos.respuesta')?.value,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.max(70),
                ]
              ),
            ],
          ],
        }),
      }),
    });
  }

  ngOnInit(): void {
    this.setSubscription('comunidadIndigena');
    this.setSubscription('hablaDialecto');
    this.setSubscription('tieneHijos');
    FormFunctions.setSelectSubscription(
      this.formData,
      'parentescoJefeHogar',
      this.relationshipCatalog,
      ['descripcion']
    );
    FormFunctions.setSelectSubscription(
      this.formData,
      'migrante',
      this.migrantCatalog,
      ['respuesta', 'descripcion']
    );

    if (this.applicationStorage.solicitud?.[this.stepName]) {
      this.formData.setValue(this.applicationStorage.solicitud[this.stepName]);
    }
  }

  public previousStep(): void {
    const step = this.inputData.tutor.respuesta ? -1 : -3;
    this.changeContent.emit(SolicitudFunctions.previousStep(step));
  }

  public nextStep(): void {
    if (!FormFunctions.showFormErrors(this.formData) || !this.isValidHijos) {
      return;
    }
    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.formData.value)
    );
  }

  /**
   * Subscribe to value change to update validators
   * @param subscriptionField field to subscribe
   */
  private setSubscription(subscriptionField: string) {
    this.formData
      .get(`${subscriptionField}.respuesta`)
      ?.valueChanges.subscribe((value) => {
        if (subscriptionField === 'tieneHijos') {
          this.formData
            .get(`${subscriptionField}.descripcion.hombres`)
            ?.setValue(0);
          this.formData
            .get(`${subscriptionField}.descripcion.mujeres`)
            ?.setValue(0);
        } else {
          this.formData.get(`${subscriptionField}.descripcion`)?.setValue('');
        }
        this.formData
          .get(`${subscriptionField}.descripcion`)
          ?.updateValueAndValidity();
      });
  }
}
