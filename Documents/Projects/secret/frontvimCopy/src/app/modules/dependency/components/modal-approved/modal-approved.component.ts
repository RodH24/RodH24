import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@data/entities';
import decode from 'jwt-decode';
import * as L from 'leaflet';
import { TrackingFlowService } from '@app/data/services';

@Component({
  selector: 'modal-approved',
  templateUrl: './modal-approved.component.html',
  styleUrls: ['./modal-approved.component.scss']
})
export class ModalApprovedComponent implements OnInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();
  public session: SessionEntity;
  public token: TokenEntity;
  public modal_title:string = '';
  public reject_list:Array<any> = [];
  public formDataReject: UntypedFormGroup;
  public formData: UntypedFormGroup;
  public show_reject_modal:boolean = false;
  public showCancelModal:boolean = false;
  public status_log_list:Array<any> = [];
  public historical_data:Array<any> = [{}];
  public enableDeliver:boolean = false;
  public actualFileName:string = '';
  public test:any;
  public rowsByPage: number = 5;
  public startSlice: number = 0;
  public endSlice: number = 5;
  public isCapturistaRol:boolean = false;
  public isResponsableRol:boolean = false;
  public selectedOptionValue:string = 'file';
  public controlOptionValue:boolean = true;
  public comments:string = '';
  public fileUrl:string = '';
  public tipoDeEntrega:string = '';
  public viewConfigForYear:any = {}

  // ====================================
  // =========== Control flow ===========
  // ====================================

  public nextStepsConfig:any = {
    entered:true
  }

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private toastr: ToastrService,
    public spinner: NgxSpinnerService, 
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    ) {
      this.token = new TokenEntity(this.cookieService);
      this.session = new SessionEntity();

    this.formDataReject = this.formBuilder.group({
      select_reason: ['', [Validators.required]],
      text_reason: [''],
    });

    this.formData = this.formBuilder.group({
      operativeCost: ['', [Validators.required, Validators.min(0)]],
      amountGranted: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.modal_title = 'Entregar solicitud:  ' + this.modalData['folio'];
    this.getStatusLogList();
    this.getConfigForYear();
  }

  public getConfigForYear(){
    this.trackingFlowService.getTrackingConfigView('aproved').subscribe((success:any)=>{
      let actualConfigView = success['result']['aproved'];
      // this fills the modal section 
      for(let item in actualConfigView){
        if(actualConfigView[item]['appear'] === true){
          this.viewConfigForYear[item] = true;
        }else
        {
          this.viewConfigForYear[item] = false;
        }
      }
    },(error:any)=>{
      console.log('❌ Error: ',error);
    });
  }


  public getStatusLogList = () =>{
    let folio = this.modalData['folio'];

    this.trackingFlowService.ListStatusLogByFolio(folio).subscribe((success:any)=>{
      this.status_log_list = success['result'][0]['estatusLog'];
    },(error:any)=>{
      this.toastr.error('Hubo un error al obtener la informacion: ', error)
    });
  }

  public getUsrData = ():any => {
    let token:any = decode(this.token.value);

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
      folio:this.modalData['folio']
    }

    let body_stringify = JSON.stringify(body);

    this.trackingFlowService.rejectApplication(body_stringify).subscribe((success:any)=>{
      this.spinner.hide();
      this.toastr.success('Se rechazó la solicitud exitosamente')
      this.interactRejectModal();
      this.onHideModalClick();

    },(error:any)=>{
      this.toastr.error('Hubo un error al rechazar la solicitud: ', error)
      this.spinner.hide();
    });

  }

  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }

  public interactRejectModal = () => {
    this.show_reject_modal = !this.show_reject_modal;
  }

  public interactCancelModal(){
    this.showCancelModal = !this.showCancelModal;
  }

  public deliverApplication = () => {
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
      folio:this.modalData['folio'],
      formDataCost: this.formData.value,
      url: this.fileUrl,
      comments: this.comments,
      tipoDeEntrega:this.tipoDeEntrega
    }

    let body_stringify = JSON.stringify(body);
    
    // this.formData.value = { operativeCost: "", amountGranted: "" }
    
    // Doesnt append document 
    if (this.test instanceof File) {
      // Append document 
      this.trackingFlowService.deliverApplication(folio,file_object,body_stringify,'appendDocument', (success:any)=>{
        this.spinner.hide();
        this.toastr.success('La solicitud se ha mandado a entregado exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({event:true,modalName:'aprobadas'});
      });
    }else{
      this.trackingFlowService.deliverApplication(folio,file_object,body_stringify,'doesntAppendDocument', (success:any)=>{
          this.spinner.hide();
          this.toastr.success('La solicitud se ha mandado a entregado exitosamente.')
          this.interactRejectModal();
          this.onHideModalClick();
          this.applicationUpdateEvent.emit({event:true,modalName:'aprobadas'});
        });
      }
  }

  public Paginate(paginador_evento:any) {
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

  public onSelect(event: any): void {
    // active btn 
    this.enableDeliver = true;
    let fileObject:File = event.addedFiles[0];
    let fileName:string = fileObject['name'];
    this.actualFileName = fileName;

    this.test = event.addedFiles[0];
  }

  public onRemove(file:any): void {
    delete this.test;
  }

  onApplicationUpdate($event: any){
    this.onHideModalClick();
    this.applicationUpdateEvent.emit({event:true,modalName:'aprobadas'});
  }

  onSelectOption(value:string):void{
    this.controlOptionValue = !this.controlOptionValue;
  }

  onSelectType(value:string):void{
    this.tipoDeEntrega = value;
  }










  /*********************************
   * CHANGE STATUS FOR APPLICATION *
   *********************************/
   public changeActualApplicationStatus(){
    let actualStatus:string = Object.keys(this.nextStepsConfig)[0];

    if(actualStatus == 'dictamination'){
      // this.dictamineApplication();
    }else{
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
