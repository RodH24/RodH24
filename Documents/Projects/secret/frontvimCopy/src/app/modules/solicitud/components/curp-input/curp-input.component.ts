import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConditionalValidator, CurpValidator, FolioValidator } from '@data/directives/';
import { ApplicationService, UtilsService } from '@data/services';
import { ControlStepperRequestEventType } from '@data/types/ControlStepperRequestEventType';
import { ApplicationStorageEntity, SessionEntity } from '@app/data/entities';
import { EncryptFunctions } from '@app/data/functions';

@Component({
  selector: 'app-curp-input',
  templateUrl: './curp-input.component.html',
  styleUrls: ['./curp-input.component.scss'],
})
export class CurpInputComponent implements OnInit {
  @Output() changeContent: EventEmitter<ControlStepperRequestEventType> =
    new EventEmitter<ControlStepperRequestEventType>();
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  public formData: UntypedFormGroup;
  /** Visibilidad de elementos */
  public curpInputModalTitle: string = 'Ingresa la Curp';
  public showCurpInputModal: boolean = false;
  public showImpulsoModal: boolean = false;
  public showFolioInput: boolean = false;
  public showCurpInput: boolean = true;
  public is16Folio: boolean = false;
  public sessionEntity = new SessionEntity();

  public vigencia = this.sessionEntity.viewingYear;


  constructor(
    private utilsService: UtilsService,
    private applicationService: ApplicationService,
    private formBuilder: UntypedFormBuilder,
    public spinner: NgxSpinnerService
  ) {
    this.formData = this.createFormData();
  }
  //047-003BD1
  get formatImpulsoValue(): string {
    let folio = this.formData.get('impulso')?.value;
    folio = folio.replace('-', '').toUpperCase();
    return `${folio.slice(0, 3)}-${folio.slice(3)}`;
  }

  ngOnInit(): void {
    this.applicationStorage.clearSolicitud();
    this.applicationStorage.clearCedula();
  }

  /********** Get Info Ciudadano ********/

  /** Show prefolio button click action */
  public onPreFolio(): void {
    this.formData = this.createFormData(true);
    this.showFolioInput = true;
    this.showCurpInput = false;
    this.showCurpInputModal = true;
    this.curpInputModalTitle = 'Ingrese el Folio';
  }

  /** Show curp button click action */
  public onEnterCurp(): void {
    this.formData = this.createFormData(false);
    this.showFolioInput = false;
    this.showCurpInput = true;
    this.showCurpInputModal = true;
    this.curpInputModalTitle = 'Ingrese la CURP'
  }

  /** Show curp button click action */
  public onEnterTarjetaImpulso(): void {
    this.showImpulsoModal = true;
    this.formData = this.createFormData();
  }

  /************* Modal Actions ***********/

  /** On close modal action */
  public onCloseModal(): void {
    this.showCurpInputModal = false;
    this.showImpulsoModal = false;
  }

  /** On submit input data  */
  public onSubmitCurp(): void {
    this.getCurpData();
  }

  /** On submit input data  */
  public onSubmitImpulso(): void {
    this.utilsService.isValidImpulso(
      this.formData.get('impulso')?.value, (data) => {
        if (data) {
          this.applicationStorage.solicitud = {
            datosContacto: {
              ...data.datosContacto,
            },
            ...('tutor' in data && data.tutor != ''
              ? {
                needTutor: true,
                tutorCurp: data.tutor,
              }
              : { needTutor: false }),
          };
          this.getCurpData(data.datosCurp.curp);
        }
      }
    );
  }

  public onChangeFolio(folio: any): void {
    if (this.formData.get('folio')?.valid) {
      this.spinner.show();
      this.applicationService.validatePreFolio(
        this.formData.get('folio')?.value,
        ({ isSuccess, curp }) => {
          this.spinner.hide();
          if (isSuccess) {
            this.showCurpInput = true;
            this.formData.get('curp')?.setValue(curp);
          }
          else {
            this.showCurpInput = false;
          }
        }
      );
    }
  }

  /**
   * Format the form group
   * @param hasFolio La accion tiene folio
   * @returns
   */
  private createFormData(hasFolio: boolean = false): UntypedFormGroup {
    if (this.showImpulsoModal) {
      return this.formBuilder.group({
        impulso: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
      });
    }
    return this.formBuilder.group({
      curp: [
        '',
        [
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18),
          CurpValidator(),
        ],
      ],
      ...(hasFolio
        ? {
          folio: [
            '',
            [
              Validators.required,
              ConditionalValidator(
                () => this.is16Folio,
                [
                  Validators.minLength(16),
                  Validators.maxLength(16),
                ],
                [
                  Validators.minLength(18),
                  Validators.maxLength(18),
                ]
              ),
              FolioValidator(),
            ],
          ],
        }
        : {}),
    });
  }

  /**
   * Emit step data
   * @param curpData service data
   */
  private emitData(curpData: any) {
    const data = {
      ...curpData,
      ...(this.showFolioInput
        ? { folio: this.formData.get('folio')?.value }
        : {}),
      ...(this.showImpulsoModal
        ? {
          folioImpulso: this.formData.get('impulso')?.value,
        }
        : {}),
    };

    this.changeContent.emit({
      isNext: true,
      step_action: 1,
      data: {
        name: 'datosCurp',
        value: data,
      },
    });
  }

  /** Service to get curp data */
  private getCurpData(curp: string = '') {
    curp = curp === '' ? this.formData.get('curp')?.value : curp;
    // this saves to local storage the curp entered for validate twice 
    const encrypt = EncryptFunctions.encryptObj(curp);
    this.applicationStorage.curp = encrypt;

    this.spinner.show();
    this.utilsService.getCurpData(curp, (curpData) => {
      this.spinner.hide();
      if (curpData) {
        this.emitData(curpData);
      }
    });
  }
}
