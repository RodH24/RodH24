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
  selector: 'modal-dictaminate-applicant',
  templateUrl: './modal-dictaminate-applicant.component.html',
  styleUrls: ['./modal-dictaminate-applicant.component.scss']
})
export class ModalDictaminateApplicantComponent implements OnInit, AfterViewInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();
  public session: SessionEntity;
  public token: TokenEntity;
  public paginator: PaginatorEntity = new PaginatorEntity();
  public map: any;
  public enableAprove: boolean = false;
  public actualFileName: string = '';
  public file_object_to_save: any;
  public modal_title: string = '';
  public reject_list: Array<any> = [];
  public show_reject_modal: boolean = false;
  public formDataReject: UntypedFormGroup;
  public weighing_list: Array<any> = [];
  public total_weigh: number = 0;
  public historical_data: Array<any> = [];
  public kpiList: Array<any> = [];
  public rejected_total: number = 0;
  public entered_total: number = 0;
  public hasCedula: boolean = false;
  public living_place: string = '';
  public isCapturistaRol: boolean = false;
  public showCancelModal: boolean = false;
  public selectedOptionValue: string = 'file';
  public controlOptionValue: boolean = true;
  public comments: string = '';
  public fileUrl: string = '';
  // ====================================
  // =========== Control flow ===========
  // ====================================

  public nextStepsConfig: any = {
    aproved: true
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
  }

  ngOnInit(): void {
    this.modal_title = 'Dictaminar solicitud:  ' + this.modalData['folio'];

    if (this.modalData['cedulaImpulso'] === false) {
      this.hasCedula = false;
    }
    else {
      this.hasCedula = true;
      this.weighing_list = [
        {
          title: 'Ciudadano',
          number: this.modalData['ciudadano']['puntaje'],
        },
        {
          title: 'Hogar',
          number: this.modalData['cedula']['datosHogar']['puntaje'],
        },
        {
          title: 'Salud',
          number: this.modalData['cedula']['datosSalud']['puntaje'],
        },
        {
          title: 'Educación',
          number: this.modalData['cedula']['datosEducacion']['puntaje'],
        },
        {
          title: 'Ingresos',
          number: this.modalData['cedula']['datosIngreso']['puntaje'],
        },
        {
          title: 'Alimentación',
          number: this.modalData['cedula']['datosAlimentacion']['puntaje'],
        },
      ];
    }

    this.living_place = this.modalData['ciudadano']['domicilio']['vialidad'];
    this.living_place += ' Ext. ' + this.modalData['ciudadano']['domicilio']['numeroExterior'];
    this.living_place += ' Int. ' + this.modalData['ciudadano']['domicilio']['numeroInterior'];

    this.sumWeigh();
    this.getHistorical();
    this.getCountKpiHistorial();
    this.getInitialData();
  }


  ngAfterViewInit(): void {
    this.configureView();
    this.initMap();
  }

  public configureView(config: Array<any> = this.configSelected) {
    // this.nextStepsConfig = this.trackingFlowService.getNextConfigFlow(
    //   config[0],
    //   config[1], 
    //   this.selectedKpi
    //   );  
    this.nextStepsConfig = { aproved: true }
  }

  public getInitialData() {
    this.trackingFlowService.getRejectList().subscribe((success: any) => {
      this.reject_list = success['result'];
    }, (error: any) => {
      this.toastr.error('Hubo un error al obtener los catalogos: ', error)
    });
  }

  public getCountKpiHistorial() {
    let curp = this.modalData['ciudadano']['curp'];
    this.trackingFlowService.getCountKpiHistorial(curp, (entered_total, rejected_total) => {

      this.kpiList.push({
        count: rejected_total,
        title: 'Solicitudes Rechazadas',
        class: 'danger',
        type: 'Rechazada',
        isActive: false
      })

      this.kpiList.push({
        count: entered_total,
        title: 'Solicitudes Entregadas',
        class: 'success',
        type: 'Ingresada',
        isActive: false
      })
    });
  }

  public onKpiSelect = (kpiType: any): void => {
  }

  public getHistorical = () => {
    let curp = this.modalData['ciudadano']['curp'];

    this.trackingFlowService.listHistoricalApplications(
      curp,
      this.paginator.page,
      ({ list, total }) => {
        this.historical_data = list;
        this.paginator.total = total;
      }
    );
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getHistorical();
  }


  public sumWeigh = () => {
    this.weighing_list.forEach((value: any) => {
      this.total_weigh = this.total_weigh + value['number'];
    });
  }

  private initMap(): void {
    let coordinates_of_living: Array<any> = [];

    if (this.modalData['ciudadano']['domicilio']['georeferencia']['coordinates'].length == 0) {
      coordinates_of_living = [21.0181, -101.258]
    }
    else {
      coordinates_of_living = this.modalData['ciudadano']['domicilio']['georeferencia']['coordinates'];
    }
    //Here we have to reverse the coordinates to show point on map
    let y = coordinates_of_living[0]
    let x = coordinates_of_living[1]
    this.map = new L.Map("map");

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://dgtit.guanajuato.gob.mx/#/"> | DGTIT | </a>',
      maxZoom: 18,
    }).addTo(this.map);

    // To hide powered by leaflet
    this.map.attributionControl.setPrefix("");

    var custom_icon = L.icon({
      iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
      iconSize: [38, 95],
      iconAnchor: [20, 70],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker(coordinates_of_living, { icon: custom_icon });
    marker.addTo(this.map);
    this.map.setView(coordinates_of_living, 15);
  }

  public fullscreen = () => {
    var elem: any = document.getElementById("dictamine-modal");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
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

  public onSelect(event: any): void {
    // active btn 
    this.enableAprove = true;
    let fileObject: File = event.addedFiles[0];
    let fileName: string = fileObject['name'];
    this.actualFileName = fileName;

    this.file_object_to_save = event.addedFiles[0];
  }

  public onRemove(file: any): void {
    delete this.file_object_to_save;
  }


  onApplicationUpdate($event: any) {
    this.onHideModalClick();
    this.applicationUpdateEvent.emit({ event: true, modalName: 'dictaminadas' });
  }

  onSelectOption(value: string): void {
    this.controlOptionValue = !this.controlOptionValue;
  }

  public approveApplication = () => {
    this.spinner.show();
    let folio = this.modalData['folio'];
    let file_object = this.file_object_to_save;
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
    if (this.file_object_to_save instanceof File) {
      this.trackingFlowService.approveApplication(folio, file_object, body_stringify, 'doesntAppendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha aprobado exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'dictaminadas' });
      });
    } else {
      // Append document 
      this.trackingFlowService.approveApplication(folio, file_object, body_stringify, 'appendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha aprobado exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'dictaminadas' });
      });
    }


  }


  /*********************************
   * CHANGE STATUS FOR APPLICATION *
   *********************************/
  public changeActualApplicationStatus() {
    let actualStatus: string = Object.keys(this.nextStepsConfig)[0];

    this.spinner.show();
    let folio = this.modalData['folio'];
    let file_object = this.file_object_to_save;
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
      if (this.file_object_to_save instanceof File) {
        // Append document 
      this.trackingFlowService.changeApplicationStatus(folio, file_object, body, 'appendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'pendientes' });
      });
    } else {
      this.trackingFlowService.changeApplicationStatus(folio, file_object, body, 'doesntAppendDocument', (success: any) => {
        this.spinner.hide();
        this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({ event: true, modalName: 'pendientes' });
      });
    }
  }
}