import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { generateDocumentTemplateStepList } from '@app/data/constants/cedula';
import { ApplicationService } from '@app/data/services';
import {
  ControlStepperRequestEventType,
  NewProgram,
  ProgramType,
} from '@app/data/types';
import { ApplicationStorageEntity, SessionEntity } from '@app/data/entities';
import { RedirectionFunctions } from '@app/data/functions';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload-stepper',
  templateUrl: './upload-stepper.component.html',
  styleUrls: ['./upload-stepper.component.scss'],
})
export class UploadStepperComponent implements OnInit {
  @ViewChild('uploadFiles') uploadFiles!: TemplateRef<any>;
  @ViewChild('uploadAcuse') uploadAcuse!: TemplateRef<any>;
  //
  @Input() editFolio: string = ''; 
  @Output() emitSuccess: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  //
  private sessionEntity = new SessionEntity();
  private vigencia: number = this.sessionEntity.viewingYear;
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();
  private documents: any = {};
  private documentsData: any = {};
  //
  public templateStepList: Array<any> = generateDocumentTemplateStepList(this, this.vigencia);
  public currentStep: number = 0;
  public programData: ProgramType = NewProgram;
  public folio: string = '';
  public fechaCaptura: string = '';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.programData = this.applicationStorage.program;
    const solicitudData = this.applicationStorage.solicitud;
    this.fechaCaptura = solicitudData?.datosCurp?.fechaCaptura;
  }

  ngAfterViewInit() {
    this.templateStepList = generateDocumentTemplateStepList(this, this.vigencia);
  }

  /**
   * Handles file upload response. Save the documents in a variable, not local storage
   * @param {ControlStepperRequestEventType} event Standard request type
   */
  public onChangeFiles(event: ControlStepperRequestEventType): void {
    if (event.isNext === true && event.step_action === 1) {
      // subir documentos especificos y estandar
      this.documents = event.data.value.files;
      this.documentsData[event.data.name] = event.data.value.data;
      this.saveSolicitud();
    } else if (event.isNext === true && event.step_action === -1) {
      // subir acuse
      this.documents = event.data.value.files[0];
      this.documentsData[event.data.name] = event.data.value.data;
      this.saveAcuse();
    } else if (event.isNext === false && event.step_action === -1){
      this.changeContent.emit({
        isNext: false,
        step_action: -1,
        data: {
          name: '',
          value: '',
        },
      });
    }
  }


  private changeStep(goToStep: number = 1): void {
    this.currentStep += goToStep;
    this.spinner.hide();
  }

  private saveSolicitud() {
    this.spinner.show();
    if (this.editFolio !== '') {
      this.applicationService.editCedula(
        this.documents,
        this.documentsData,
        ({ folio }) => {
          this.spinner.hide();
          if(folio.length) {
            RedirectionFunctions.redirectToSolicitudPanel(this.router);
          }
        }
      )
    } else if (this.programData.modalidad?.cedula) {
      this.applicationService.createCedula(
        this.documents,
        this.documentsData,
        false,
        ({ folio }) => {
          this.spinner.hide();
          if (folio !== '') {
            this.handleSuccessResponse(folio);
          }
        }
      );
    } else {
      this.applicationService.createSolicitud(
        this.documents,
        this.documentsData,
        false,
        ({ folio }) => {
          this.spinner.hide();
          if (folio !== '') {
            this.handleSuccessResponse(folio);
          }
        }
      );
    }
  }

  private getDifferences(after: any, before: any): any {
    const afterEntries = Object.entries(after)
    const beforeEntries = Object.entries(before)

    let arrayDifferences = beforeEntries
        .reduce<any[]>((differences, [propName, itemBeforeValue]) => {
            const itemDifferences = this.getDifferences(itemBeforeValue, after[propName])
                .map((difference: any) => ({
                    ...difference,
                    path: [propName, ...difference.path],
                }))
            return [
                ...differences,
                ...itemDifferences,
            ]
        }, [])

    if (afterEntries.length > beforeEntries.length) {
        arrayDifferences = [
            ...arrayDifferences,
            ...afterEntries.slice(beforeEntries.length)
                .map<any>(([propName, itemAfterValue]) => ({
                    path: [propName],
                    before: undefined,
                    after: itemAfterValue,
                })),
        ]
    }

    return arrayDifferences
  }
  
  private handleSuccessResponse(folio: string): any {
    this.documentsData = {};
    this.folio = folio;
    this.changeStep();
  }

  private saveAcuse() {
    this.spinner.show();
    this.applicationService.uploadAcuse(
      this.folio,
      this.documentsData['Acuse'] ?? this.documentsData['Solicitud'],
      this.documents,
      (isSuccess) => {
        this.spinner.hide();
        if (isSuccess) this.emitSuccess.emit(this.folio);
      }
    );
  }
}