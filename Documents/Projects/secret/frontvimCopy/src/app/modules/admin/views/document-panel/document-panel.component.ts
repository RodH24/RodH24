import { Component, OnInit, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { MiniKpiClassType } from '@data/types';
import { TrackingFlowService, AcuseService, ApplicationService } from '@data/services';
import { SolicitudPanelFunctions } from '@app/data/functions';

@Component({
  selector: 'document-panel',
  templateUrl: './document-panel.component.html',
  styleUrls: ['./document-panel.component.scss'],
})
export class DocumentPanelComponent implements OnInit {
  @Input() modalData: any;
  //
  public paginator: PaginatorEntity = new PaginatorEntity();
  public token: TokenEntity;
  public session: SessionEntity = new SessionEntity();
  public kpiList: Map<string, MiniKpiClassType> = new Map();
  public sessionQlist: Array<any> = [];
  public base_list_folios: Array<any> = []; // pending for 
  public entered_list_folios: Array<any> = [];
  public cardList!: Array<any>;
  public selectedQ: any;
  public notData: boolean = false;
  public filterWord: string = '';
  public isFiltered: boolean = false;
  public term: string = '';
  public tagValue: Array<string> = [];
  public listTagFolios: Array<{ folio: string; id: string }> = [];
  public titleTag: string = 'Ingresa los folios que desees ';
  public titleTagButton: string = 'Seleccionar';
  public array_control_folios_validate: Array<string> = [];
  public array_control_folios_dictaminate: Array<string> = [];
  public array_control_folios_aproved: Array<string> = [];
  public action_badge_validate: number = 0;
  public action_badge_dictaminate: number = 0;
  public action_badge_aproved: number = 0;
  public panelType: string = 'pendientes';
  public selectedStatus: string = 'Pendiente';
  // Maps that shows the minikpi data
  public tracking_kpi_list: Map<string, MiniKpiClassType> = new Map();
  public citizen_modal: boolean = false;
  public tracking_card_list: Array<any> = [];
  public show_validate_modal: boolean = false;
  public show_dictamine_modal: boolean = false;
  public show_deliver_modal: boolean = false;
  public show_approved_modal: boolean = false;
  public show_validate_change_modal: boolean = false;
  public show_rejected_list_modal: boolean = false;
  public showDocumentsModal: boolean = false;
  public nzTitle: string = 'Documentos para visualizar';
  public controlShowDocumentModal: boolean = false;
  public standar_documents: Array<any> = [];
  public specific_documents: Array<any> = [];
  public data: any;
  public selectedApoyo: string = '-';
  public configSelected: Array<any> = [];
  public selectedMunicipio: string = '-';
  public vigencia = this.session.viewingYear;
  
  get allDocuments(): Array<any> {
    return [...this.standar_documents, ...this.specific_documents];
  }

  constructor(
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    private applicationService: ApplicationService,
    private acuseService: AcuseService,

  ) {
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
    
  }

  // Event when clicking on select of support types 
  public updateSelectedApoyo(apoyoEvent: any) {
    this.configSelected = apoyoEvent;
    if (apoyoEvent[1] === null) {
      // this.refreshData();
    } else {
      this.configViewMiniKpi(apoyoEvent);
    }
    // this.getkpiDataList()
  }

  public configViewMiniKpi(supportType: any = '-', selectedStatus: string = 'Pendiente', activeRol: any = this.session.getActiveRole) {
    let filteredKpiList = this.trackingFlowService.configViewMiniKpiAll(supportType, selectedStatus, activeRol);
    let miniKpiData = filteredKpiList[0];
    let CardData = filteredKpiList[1];
    this.kpiList = miniKpiData;
    this.cardList = CardData;
    this.getApplicationListByStatus()
  }

  public onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return 0;
  }

  public onKpiSelect(kpiType: any) {
    const kpiList = this.kpiList;

    for (const [key, mapElementData] of kpiList) {
      mapElementData.isActive = mapElementData.type === kpiType;
      kpiList.set(key, mapElementData);
    }

    this.selectedStatus = kpiType;
    this.getApplicationListByStatus();
  }

  private getApplicationListByStatus(): void {
    this.spinner.show();
    this.applicationService.listSolicitud(
      this.paginator.page,
      this.selectedStatus,
      // SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
      this.configSelected[0], // update selected apoyo
      this.filterWord.length ? this.filterWord : null,
      this.selectedMunicipio?.length ? this.selectedMunicipio : null,
      null,
      ({ list, total }) => {
        if (!total) {
          this.cardList = [];
          this.paginator.total = 0;
          this.notData = true;
          this.spinner.hide();
        } else {
          this.notData = false;
          this.cardList = list;
          this.paginator.total = total;
          // this.filterFoliosList();
          this.spinner.hide();
        }
      }
    );
  }

  public onSolicitudFilter() {
    this.isFiltered = true;
    if (this.selectedStatus !== '') {
      this.getApplicationListByStatus();
    }
  }

  public onApplicantCardClick(data: any): void {
    this.data = { ...data.ciudadano, folio: data.folio };
    this.standar_documents = data.documentos.estandar;
    this.specific_documents = data.documentos.especifico
    this.controlShowDocumentModal = true;
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getkpiDataList();
  }

  private getkpiDataList(): void {
    this.spinner.show();
    this.getApplicationListByStatus();
  }

  public onClearFilter(): void {
    this.isFiltered = false;
    this.filterWord = '';
    this.getApplicationListByStatus();
  }

  public onTopNavigation(event: any) {
    window.scroll(0, 0);
  }


  public actionsOnFolioEvent(event: {
    control: boolean;
    estatus: string;
    data: string;
  }) {
    if (event.estatus === 'Validada') {
      if (event.control === false) {
        // delete from the array
        const index = this.array_control_folios_validate.indexOf(event.data);
        if (index > -1) {
          this.array_control_folios_validate.splice(index, 1);
        }
        this.action_badge_validate = this.array_control_folios_validate.length;
      } else {
        // push to the array
        this.array_control_folios_validate.push(event.data);
        this.action_badge_validate = this.array_control_folios_validate.length;
      }
    } else if (event.estatus === 'Dictaminacion') {
      if (event.control === false) {
        // delete from the array
        const index = this.array_control_folios_dictaminate.indexOf(event.data);
        if (index > -1) {
          this.array_control_folios_dictaminate.splice(index, 1);
        }
        this.action_badge_dictaminate =
          this.array_control_folios_dictaminate.length;
      } else {
        // push to the array
        this.array_control_folios_dictaminate.push(event.data);
        this.action_badge_dictaminate =
          this.array_control_folios_dictaminate.length;
      }
    } else if (event.estatus === 'Aprobada') {
      if (event.control === false) {
        // delete from the array
        const index = this.array_control_folios_aproved.indexOf(event.data);
        if (index > -1) {
          this.array_control_folios_aproved.splice(index, 1);
        }
        this.action_badge_aproved = this.array_control_folios_aproved.length;
      } else {
        // push to the array
        this.array_control_folios_aproved.push(event.data);
        this.action_badge_aproved = this.array_control_folios_aproved.length;
      }
    }
  }

  onHideModalClick(): void {
    this.controlShowDocumentModal = !this.controlShowDocumentModal;
  }

  public showPdf(isCedula: boolean = true) {
    this.acuseService.getFileByFolio(this.vigencia, this.data.folio, isCedula);
  }

  public downloadFile = (document: any) => {
    let url_path = document.fileList[0].urlPath;

    this.spinner.show();
    this.trackingFlowService.downloadFile(url_path).subscribe(
      (success: any) => {
        this.spinner.hide();
        window.open(success.result.signedRequest, '_blank');
      },
      (error: any) => {
        // this.toastr.error('Hubo un error al descargar el archivo: ', error);
        this.spinner.hide();
      }
    );
  }
}
