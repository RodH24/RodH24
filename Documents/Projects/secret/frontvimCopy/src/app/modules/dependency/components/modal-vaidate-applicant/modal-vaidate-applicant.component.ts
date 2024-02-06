import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@data/entities';
import decode from 'jwt-decode';
import { ApplicationService,TrackingFlowService } from '@app/data/services';
import { generate } from "@pdfme/generator";
import { template, generateInputsArray} from "@data/constants/anexo3";

@Component({
  selector: 'modal-validate-applicant',
  templateUrl: './modal-vaidate-applicant.component.html',
  styleUrls: ['./modal-vaidate-applicant.component.scss']
})
export class ModalVaidateApplicantComponent implements OnInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();
  public session: SessionEntity;
  public token: TokenEntity;
  public reject_list: Array<any> = [];
  public modal_title: string = '';
  public show_reject_modal: boolean = false;
  public formDataReject: UntypedFormGroup;
  // For upload file 
  public loading: boolean = false;
  public avatarUrl?: string;
  public files: {
    [fileName: string]: {
      file: File;
    };
  } = {
    };
  public test: any;
  public actualFileName: string = '';
  public enableDictamination: boolean = false;
  public showCancelModal: boolean = false;
  public selectedOptionValue: string = 'file';
  public controlOptionValue: boolean = true;
  public comments: string = '';
  public fileUrl: string = '';
  public userDate: Date = new Date();

  // ====================================
  // =========== Control flow ===========
  // ====================================

  public nextStepsConfig: any = {
    dictamination: true
  }
  public viewConfigForYear: any = {}


  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    private applicationService: ApplicationService,
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
    
    this.formDataReject = this.formBuilder.group({
      select_reason: ['', [Validators.required]],
      text_reason: [''],

    });
  }

  ngOnInit(): void {
    this.modal_title = 'Validar solicitud:  ' + this.modalData['folio'];
    this.isCapturista();
    this.isResponsable();
    this.getConfigForYear();
  }

  ngAfterViewInit(): void {
    this.configureView();
  }

  public getConfigForYear() {
    this.trackingFlowService.getTrackingConfigView('validated').subscribe((success: any) => {
      let actualConfigView = success['result']['validated'];
      // this fills the modal section 
      for (let item in actualConfigView) {
        if (actualConfigView[item]['appear'] === true) {
          this.viewConfigForYear[item] = true;
        } else {
          this.viewConfigForYear[item] = false;
        }
      }
    }, (error: any) => {
      console.log('❌ Error: ', error);
    });
  }

  public configureView(config: Array<any> = this.configSelected) {
    this.nextStepsConfig = this.trackingFlowService.getNextConfigFlow(
      config[0],
      config[1],
      this.selectedKpi
    );
  }

  isCapturista() {
  }
  public isResponsable() {
  }

  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }

  public interactRejectModal = () => {
    this.show_reject_modal = !this.show_reject_modal;
  }

  public interactCancelModal() {
    this.showCancelModal = !this.showCancelModal;
  }

  public getUsrData = (): any => {
    let token: any = decode(this.token.value);

    let usuarioCaptura = {
      id: token['uid'],
      nombre: token['name'],
      email: token['email'],
      codigoRol: token['roleCode'],
      rol: token['roleName']
    }

    return usuarioCaptura;
  }

  public rejectApplication = () => {
    this.spinner.show();

    let usr_data = this.getUsrData();

    let actual_state = {
      codigo: this.modalData['estatusActual']['codigo'],
      descripcion: this.modalData['estatusActual']['descripcion']
    }

    let body = {
      form_data: this.formDataReject.value,
      usr_data: usr_data,
      actual_state: actual_state,
      folio: this.modalData['folio']
    }

    let body_stringify = JSON.stringify(body);
  }

  public dictamineApplication() {
    this.spinner.show();
    let folio = this.modalData['folio'];
    let file_object = this.test;
    let usr_data = this.getUsrData();
    let actual_state = {
      codigo: this.modalData['estatusActual']['codigo'],
      descripcion: this.modalData['estatusActual']['descripcion']
    }
    let body = {
      usr_data: usr_data,
      actual_state: actual_state,
      folio: this.modalData['folio'],
      url: this.fileUrl,
      comments: this.comments
    }
    let body_stringify = JSON.stringify(body);

    // Doesnt append document 
    if (!this.enableDictamination == true) {
      this.trackingFlowService.dictamineApplication(folio, file_object, body_stringify, 'doesntAppendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha mandado a dictaminación exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'validadas' });
      });
    } else {

      // Append document 
      this.trackingFlowService.dictamineApplication(folio, file_object, body_stringify, 'appendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha mandado a dictaminación exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'validadas' });
      });
    }


  }

  public onSelect(event: any): void {
    this.enableDictamination = true;

    let fileObject: File = event.addedFiles[0];
    let fileName: string = fileObject['name'];
    this.actualFileName = fileName;

    this.test = event.addedFiles[0];
  }

  private async readFile(file: File): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  public onRemove(file: any): void {
    delete this.test;
  }

  onApplicationUpdate($event: any) {
    this.onHideModalClick();
    this.applicationUpdateEvent.emit({ event: true, modalName: 'validadas' });
  }

  onSelectOption(value: string): void {
    this.controlOptionValue = !this.controlOptionValue;
  }

  public async downloadAnexo3() {
    console.dir(this.modalData,{depth:null});
    const font = {
      century: {
        data: await fetch(
          "./assets/fonts/CenturyGothic/Century-Gothic.ttf"
        ).then((res) => res.arrayBuffer()),
        fallback: true,
      },
    };
    this.applicationService.getSolicitud(
      this.modalData.folio,
      (SolicitudData) => {
        const inputs = generateInputsArray(
          SolicitudData
        );

        generate({ template, inputs, options: { font } }).then(
          (pdf: any) => {
            const blob = new Blob([pdf.buffer], {
              type: "application/pdf",
            });
            window.open(URL.createObjectURL(blob));
          }
        );
      }
    );
  }

  /*********************************
   * CHANGE STATUS FOR APPLICATION *
   *********************************/
  public changeActualApplicationStatus() {
    let actualStatus: string = Object.keys(this.nextStepsConfig)[0];

    if (actualStatus == 'dictamination') {
      this.dictamineApplication();
    } else {
      this.spinner.show();
      let folio = this.modalData['folio'];
      let file_object = this.test;
      let usr_data = this.getUsrData();
      let actual_state = {
        codigo: this.modalData['estatusActual']['codigo'],
        descripcion: this.modalData['estatusActual']['descripcion']
      }
      let body = {
        nextStatus: actualStatus,
        usr_data: usr_data,
        actual_state: actual_state,
        folio: this.modalData['folio'],
        url: this.fileUrl,
        comments: this.comments,
        userDate: this.userDate
      }


      //   this.trackingFlowService.changeApplicationStatus(this.modalData.folio, file_object, type, (response:any)=>{
      //   this.spinner.hide();
      //   let responseControl:boolean = response[0]['response'];
      //   let responseMessage:string = response[0]['message'];
      //   if(responseControl === true){
      //     this.toastr.success(responseMessage);
      //     this.onHideModalClick();
      //     this.applicationUpdateEvent.emit({ event: true, modalName: 'pendientes' });
      //   }else{
      //     this.toastr.error(responseMessage);
      //   }
      // });

      if (this.test instanceof File) {
        // Append document 
        this.trackingFlowService.changeApplicationStatus(folio, file_object, body, 'appendDocument', (success: any) => {
          this.spinner.hide();
          this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
          this.interactRejectModal();
          this.onHideModalClick();
          this.applicationUpdateEvent.emit({ event: true, modalName: 'aprobadas' });
        });
      } else {
        this.trackingFlowService.changeApplicationStatus(folio, file_object, body, 'doesntAppendDocument', (success: any) => {
          this.spinner.hide();
          this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
          this.interactRejectModal();
          this.onHideModalClick();
          this.applicationUpdateEvent.emit({ event: true, modalName: 'aprobadas' });
        });
      }
    }
  }
}