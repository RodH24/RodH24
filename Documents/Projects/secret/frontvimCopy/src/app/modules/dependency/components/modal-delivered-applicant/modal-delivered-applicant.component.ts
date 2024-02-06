import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import { TrackingFlowService } from '@app/data/services';

@Component({
  selector: 'modal-delivered-applicant',
  templateUrl: './modal-delivered-applicant.component.html',
  styleUrls: ['./modal-delivered-applicant.component.scss']
})
export class ModalDeliveredApplicantComponent implements OnInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();

  public token: TokenEntity;
  public modal_title: string = 'Historial de solicitud';
  public reject_list: Array<any> = [];
  public show_reject_modal: boolean = false;
  public status_log_list: Array<any> = [];
  public historical_data: Array<any> = [{}];
  public rowsByPage: number = 5;
  public startSlice: number = 0;
  public endSlice: number = 5;
  public standar_documents: Array<any> = [];
  public specific_documents: Array<any> = [];
  public evidences_documents: Array<any> = [];

  get allDocuments(): Array<any> {
    return [...this.standar_documents, ...this.specific_documents, ...this.evidences_documents];
  }

  constructor(private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private trackingFlowService: TrackingFlowService,
    private cookieService: CookieService
  ) {
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
    this.getStatusLogList();

    this.standar_documents = this.modalData.documentos.estandar;
    this.specific_documents = this.modalData.documentos.especifico;
    this.evidences_documents = (this.modalData.documentos.evidencia) ? (this.modalData.documentos.evidencia) : this.evidences_documents;
  }

  public getStatusLogList = () => {
    let folio = this.modalData['folio'];
    this.trackingFlowService.ListStatusLogByFolio(folio).subscribe((success: any) => {
    this.createStatusListWithEvidences(success['result'][0]['documentos']['evidencia'], success['result'][0]['estatusLog']);
    }, (error: any) => {
      this.toastr.error('Hubo un error al obtener la informacion: ', error)
    });

  }

  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }

  public createStatusListWithEvidences(evidences: any, statusLog: any) {

    let newStatusLogList: Array<any> = [];
    let evidenceCodes: Array<any> = [];

    // has evidences 
    if (evidences != undefined && evidences.length >= 1) {
      // For status log 
      for (let statusLogValue of statusLog) {
        // for evidences 
        for (let evidenceValue of evidences) {
          let statusLogCode = statusLogValue['codigo'];
          let evidenceCode = evidenceValue['estatusActual']['codigo'];
          let dateEvidence = evidenceValue['estatusActual']['fecha'];

          if (statusLogCode == evidenceCode) {
            // Find the object on the final list 
            let evidenceObjectExists = newStatusLogList.find(element => {
              if (element.date == dateEvidence) {
                return true
              }
              else {
                return false
              }
            });

            if (evidenceObjectExists !== undefined) {
            } else {
              evidenceCodes.push(evidenceCode);
              let newComment = '';
              if (statusLogValue['observaciones'] !== undefined) {
                if (statusLogValue['observaciones']['descripcion']) {
                  newComment = statusLogValue['observaciones']['descripcion']
                } else {
                  if (statusLogValue['comentarios_estatus']) {
                    newComment = statusLogValue['comentarios_estatus']
                  } else {
                    newComment = 'No contiene comentarios'
                  }
                }
              }
              let newObj = {
                codigo: evidenceCode,
                description: evidenceValue['estatusActual']['descripcion'],
                date: dateEvidence,
                usr: evidenceValue['estatusActual']['usuarioCaptura']['nombre'],
                email: evidenceValue['estatusActual']['usuarioCaptura']['email'],
                evidence: evidenceValue['fileList'][0]['urlPath'],
                comment: newComment
              }

              newStatusLogList.push(newObj);
            }
          }
        }
      }

      // removing data 
      for (let m of evidenceCodes) {
        const removeIndex = statusLog.findIndex((item: any) => item.codigo == m);
        statusLog.splice(removeIndex, 1);
      }

      // complete array with ones that doesnt have evidences 
      for (let statusLogValue of statusLog) {
        let newComment = '';
        if (statusLogValue['observaciones'] !== undefined) {
          if (statusLogValue['observaciones']['descripcion']) {
            newComment = statusLogValue['observaciones']['descripcion']
          } else {
            if (statusLogValue['comentarios_estatus']) {
              newComment = statusLogValue['comentarios_estatus']
            } else {
              newComment = 'No contiene comentarios'
            }
          }
        }

        let newObj = {
          codigo: statusLogValue['codigo'],
          description: statusLogValue['descripcion'],
          date: statusLogValue['fecha'],
          usr: statusLogValue['usuarioCaptura']['nombre'],
          email: statusLogValue['usuarioCaptura']['email'],
          comment: newComment
        }
        newStatusLogList.push(newObj);
      }

      //last step to change '' into text
      for (let m of newStatusLogList) {
        if (m['comment'] === '') {
          m['comment'] = 'No contiene comentarios'
        }
      }

      // const sortedDataByDate = newStatusLogList.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
      // this.status_log_list = sortedDataByDate;
    } else {

      //doesnt has evidences 
      for (let statusLogValue of statusLog) {
        let newComment = '';
        if (statusLogValue['observaciones'] !== undefined) {
          if (statusLogValue['observaciones']['descripcion']) {
            newComment = statusLogValue['observaciones']['descripcion']
          } else {
            if (statusLogValue['comentarios_estatus']) {
              newComment = statusLogValue['comentarios_estatus']
            } else {
              newComment = 'No contiene comentarios'
            }
          }
        }
        let newObj = {
          codigo: statusLogValue['codigo'],
          description: statusLogValue['descripcion'],
          date: statusLogValue['fecha'],
          usr: statusLogValue['usuarioCaptura']['nombre'],
          email: statusLogValue['usuarioCaptura']['email'],
          comment: newComment
        }

        newStatusLogList.push(newObj);
      }

      //last step to change '' into text
      for (let m of newStatusLogList) {
        if (m['comment'] === '') {
          m['comment'] = 'No contiene comentarios'
        }
      }

    }

    const sortedDataByDate = newStatusLogList.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    this.status_log_list = sortedDataByDate;
  }

  public downloadFile = (document: string) => {
    if(document) {
      let url_path = document;

      this.spinner.show();
      this.trackingFlowService.downloadFile(url_path).subscribe(
        (success: any) => {
          this.spinner.hide();
          window.open(success.result.signedRequest, "_blank");
        },
        (error: any) => {
          this.toastr.error("Hubo un error al descargar el archivo: ", error);
          this.spinner.hide();
        }
      );
    } else {
      this.toastr.warning("Lo sentimos, el archivo seleccionado no se encuentra disponible");
    }
    
  };

  public downloadFileItem = (document: any) => {
    let url_path = document.fileList[0].urlPath;

    this.spinner.show();
    this.trackingFlowService.downloadFile(url_path).subscribe(
      (success: any) => {
        this.spinner.hide();
        window.open(success.result.signedRequest, "_blank");
      },
      (error: any) => {
        this.toastr.error("Hubo un error al descargar el archivo: ", error);
        this.spinner.hide();
      }
    );
  };

  Paginate(paginador_evento: any) {
    let indice_pagina = paginador_evento - 1;
    let serie_limites = [];

    let cantidad_registros = this.status_log_list.length;
    let secciones =
      Math.round(cantidad_registros / this.rowsByPage) + 1;

    let contador = 0;
    for (let m = 0; m < secciones; m++) {
      if (m == 0) {
        serie_limites.push({
          inferior: 0,
          superior: contador + this.rowsByPage,
        });
        contador = contador + this.rowsByPage;
      } else {
        serie_limites.push({
          inferior: contador,
          superior: contador + this.rowsByPage,
        });
        contador = contador + this.rowsByPage;
      }
    }

    this.startSlice = serie_limites[indice_pagina]["inferior"];
    this.endSlice = serie_limites[indice_pagina]["superior"];
  }

  public downloadZip(documentArray: any) {
    let finalList: Array<string> = [];
    this.spinner.show();
    let control = 0;

    for (let file of documentArray) {
      let signedUrl: any = file.fileList[0].urlPath;
      this.trackingFlowService.downloadFile(signedUrl).subscribe((success: any) => {
        finalList.push(success.result.signedRequest);
        control++;
        if (control == documentArray.length) {
          this.trackingFlowService.generateZipByFolio(this.modalData.folio).subscribe((final_success: any) => {
          },
            (error: any) => {
              console.log('error: ',error);
            }
          );
        }
      },
        (error: any) => {
          this.toastr.error("Hubo un error al descargar el archivo: ", error);
          this.spinner.hide();
        }
      );
    }
  }
}