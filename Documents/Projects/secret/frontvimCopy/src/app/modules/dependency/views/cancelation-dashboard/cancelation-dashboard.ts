import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { MiniKpiClassType } from '@data/types';
import { ApplicationService, TrackingFlowService } from '@data/services';
import { SolicitudPanelFunctions } from '@app/data/functions';

@Component({
  selector: 'cancelation-dashboard',
  templateUrl: './cancelation-dashboard.html',
  styleUrls: ['./cancelation-dashboard.scss'],
})
export class CancelationDashboardComponent implements OnInit {
  public token: TokenEntity;
  public paginator: PaginatorEntity = new PaginatorEntity();
  public session: SessionEntity;
  public notData: boolean = false;
  public sessionQlist: Array<any> = [];
  private selectedApoyo: string = '-';
  public filterWord: string = '';
  public isFiltered: boolean = false;
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
  public selectedStatus: string = 'Cancelada';
  // Maps that shows the minikpi data
  public kpiList: Map<string, MiniKpiClassType> = new Map();
  public tracking_kpi_list: Map<string, MiniKpiClassType> = new Map();
  public cardList!: Array<any>;
  public tracking_card_list: Array<any> = [];
  public modalData: any;
  public observationModal: boolean = false;
  public captureUser: string = '';
  public standar_documents: Array<any> = [];
  public specific_documents: Array<any> = [];
  public documents: any = {};
  public configSelected: Array<any> = [];
  nzTabPosition: NzTabPosition = 'top';
  selectedIndex = 0;

  get standardDocuments(): Array<any> {
    return this.modalData?.documentos.estandar ?? [];
  }

  get specificDocuments(): Array<any> {
    return this.modalData?.documentos.especifico ?? [];
  }

  get allDocuments(): Array<any> {
    return [...this.standar_documents, ...this.specific_documents];
  }

  get solicitudStandardDocuments(): Array<any> {
    return this.documents.estandar;
  }

  get solicitudProgramDocuments(): Array<any> {
    return this.documents.especifico;
  }

  constructor(
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    private applicationService: ApplicationService,
  ) {
    this.session = new SessionEntity();
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
  }

  private getKpiCountList(): void {
    this.trackingFlowService.getKpiCountList(SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),(data: any) => {
        data.observation.isActive = true;
        this.kpiList.set("canceled", data.canceled);
      }
    );
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

  public configViewMiniKpi(supportType: any = '-', selectedStatus: string = 'Cancelada', activeRol: any = this.session.getActiveRole) {
    this.selectedApoyo = supportType[0];

    this.trackingFlowService.getKpiCountList(this.selectedApoyo,(data: any) => {
      data.observation.isActive = true;
      this.kpiList.set("canceled", data.canceled);
    this.getApplicationList()
    }
  );
  }

  public onKpiSelect(kpiType: any) {
    const kpiList = this.kpiList;

    for (const [key, mapElementData] of kpiList) {
      mapElementData.isActive = mapElementData.type === kpiType;
      kpiList.set(key, mapElementData);
    }

    this.selectedStatus = kpiType;
    this.getApplicationList();
  }

  private getApplicationList(): void {
    this.spinner.show();
    this.applicationService.listSolicitud(
      this.paginator.page,
      'Cancelada', //this.selectedStatus,
      SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
      this.filterWord.length ? this.filterWord : null,
      null,
      null,
      ({ list, total }) => {
        if (list.length == 0) {
          this.cardList = list;
          this.paginator.total = 0;
          this.notData = true;
          this.spinner.hide();
        } else {
          this.notData = false;
          this.cardList = list;
          this.paginator.total = total;
          this.spinner.hide();
        }
      }
    );
  }
 

  private filterFoliosList() {
    this.listTagFolios = this.cardList.map((element) => {
      return { folio: element.folio, id: element._id };
    });
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getApplicationList();
  }

  public onSolicitudFilter() {
    this.isFiltered = true;
    if (this.selectedStatus !== '') {
      this.getApplicationList();
    } else {
    }
  }

  public onClearFilter(): void {
    this.isFiltered = false;
    this.filterWord = '';
    if (this.selectedStatus !== '') {
      this.getApplicationList();
    }
  }


  private listSolicitudByPanelAndWord(): void {
    this.spinner.show();

  }

  public onTopNavigation(event: any) {
    window.scroll(0, 0);
  }

  // EVENT WHEN MODAL TRACKING FLOW IS CLOSED TO SHOW AGAIN NEW DATA
  public onApplicationUpdate(event: any): void {
    // this enable the actual state filter and get new data
    this.getKpiCountList();

    // Pendiente-pending (*)
    if (event['modalName'] == 'pendientes') {

      this.onKpiSelect('Pendiente');
    }
    // Validada-validated (*)
    if (event['modalName'] == 'validadas') {

      this.onKpiSelect('Validada');
    }
    // En Dictaminacion-dictamination (*)
    if (event['modalName'] == 'dictaminadas') {

      this.onKpiSelect('Dictaminacion');
    }
    // Aprobada-aproved (*)
    if (event['modalName'] == 'aprobadas') {

      this.onKpiSelect('Aprobada');
    }
    // Entregada-entered
    // Rechazada-rejected
  }

  public onCompare(
    _left: KeyValue<any, any>,
    _right: KeyValue<any, any>
  ): number {
    return 0;
  }

  public onApplicantCardClick(data_event: any): void {

    if (data_event['estatusActual']['descripcion'] == 'Cancelada') {
      this.modalData = data_event;
      this.observationModal = true;
    }
  }

  public onHideModal(): void {
    this.observationModal = false;
  }

  actionsOnFolioEvent(event: any) {

  }

  onHideModalClick() {
    this.observationModal = false;
  }

  public fileExists(documents: any, key: string): boolean {

    if (documents) {
      // Search the name of the file on the docs structure 
      return documents.some((obj: any) => obj.nombre == key);
    }
    return false;
  }

  public getFileUrl(documents: any, key: string): any {
    for (let m in documents) {
      if (documents[m]['nombre'] == key) {
        return documents[m]['signedUrl'];
      }
    }
  }

  public colseDeliverredModal() {
    this.observationModal = !this.observationModal;
  }
}