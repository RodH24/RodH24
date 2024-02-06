import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApplicationStorageEntity } from '@app/data/entities';
import { ApplicationService, ProgramService } from '@app/data/services';
import { ControlStepperRequestEventType } from '@app/data/types';
@Component({
  selector: 'app-documents-update-modal',
  templateUrl: './documents-update-modal.component.html',
  styleUrls: ['./documents-update-modal.component.scss'],
})
export class DocumentsUpdateModalComponent implements OnInit {
  @Input() cardData: any = {};
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  public program: any = {};
  public showSuccess: boolean = false;
  //
  private storage: ApplicationStorageEntity = new ApplicationStorageEntity();

  constructor(
    private programService: ProgramService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.getProgram();
    this.storage.documents = this.cardData.documentosInvalidos;
  }

  /*****************************
   ************ EVENT **********
   *****************************/
  public onClose(isRefresh: boolean = this.showSuccess): void {
    this.storage.clearAll();
    this.onCloseModal.emit(isRefresh);
  }

    public onChangeFiles(event: ControlStepperRequestEventType): void {
    const files = event.data.value.files;
    const documentsData = event.data.value.data;

    this.applicationService.updateDocuments(
      this.cardData.folio,
      documentsData,
      files,
      (success) => {
        this.showSuccess = success;
      }
    );
  }

  /*****************************
   ********* DATABASE **********
   *****************************/

  private getProgram(): void {
    this.programService.get(
      null,
      this.cardData.programa.q,
      this.cardData.programa.modalidad.clave,
      this.cardData.programa.modalidad.tipoApoyo.clave,
      null,
      (data: any) => {
        data.documentos.push({
          orden: 0,
          nombre: 'Formato de Firma y Acuse',
          alternativo: '',
          tiposDocumentos: [],
        });
        data.documentos.push({
          orden: 0,
          nombre: 'Acuse',
          alternativo: '',
          tiposDocumentos: [],
        });
        this.program = data;
      }
    );
  }
}
