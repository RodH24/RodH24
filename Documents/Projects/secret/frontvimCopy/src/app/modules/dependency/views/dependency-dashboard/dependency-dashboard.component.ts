import { Component, Input, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { MiniKpiClassType } from '@data/types';
import { TrackingFlowService, CatalogService, ApplicationService } from '@data/services';
import { SolicitudPanelFunctions } from '@app/data/functions';

@Component({
  selector: 'app-dependencia-dashboard',
  templateUrl: './dependency-dashboard.component.html',
  styleUrls: ['./dependency-dashboard.component.scss'],
})
export class DependenciaDashboardComponent implements OnInit {
  public paginator: PaginatorEntity = new PaginatorEntity();
  public token: TokenEntity;
  public session: SessionEntity;
  public kpiList: Map<string, MiniKpiClassType> = new Map();
  public sessionQlist: Array<any> = [];
  public base_list_folios: Array<any> = []; // pending for 
  public entered_list_folios: Array<any> = [];
  public cardList!: Array<any>;
  public selectedQ: any;
  public notData: boolean = false;
  public filterWord: string = '';
  public modalData: any;
  public citizen_modal: boolean = false;
  public selectedStatus: string = 'Pendiente';
  public isFiltered: boolean = false;
  public isMnpFiltered: boolean = false;
  public show_validate_modal: boolean = false;
  public show_dictamine_modal: boolean = false;
  public show_deliver_modal: boolean = false;
  public show_approved_modal: boolean = false;
  public show_validate_change_modal: boolean = false;
  public show_rejected_list_modal: boolean = false;
  public selectedApoyo: string = '-';
  public selectedKpi: string = '';
  public configSelected: Array<any> = [];
  public municipioList: Array<{
    id_municipio: string,
    nombre_municipio: string
  }> = [];
  public selectedMunicipio: string = '-';
  public actualSupportTypeSelected: any;

  constructor(
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    private applicationService: ApplicationService,
    private catalogService: CatalogService
  ) {
    this.session = new SessionEntity();
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
    this.getMunicipioList();
  }

  // Event when clicking on select of support types 
  public updateSelectedApoyo(apoyoEvent: any) {
    this.configSelected = apoyoEvent;

    if (apoyoEvent[1] === null) {
      // this.refreshData();
    } else {
      this.actualSupportTypeSelected = apoyoEvent;
      this.configViewMiniKpi(apoyoEvent);
    }
    // this.getkpiDataList()
  }

  public configViewMiniKpi(supportType: any = this.actualSupportTypeSelected, selectedStatus: string = 'Pendiente', activeRol: any = this.session.getActiveRole) {
    let filteredKpiList = this.trackingFlowService.configViewMiniKpi(supportType, selectedStatus, activeRol);
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

  public onApplicantCardClick(data_event: any): void {
    this.modalData = data_event;
    let statusSelected = data_event['estatusActual']['descripcion'];

    if (statusSelected == 'Rechazada') {
      this.show_rejected_list_modal = true;
    } else if (statusSelected == 'Validada') {
      this.show_validate_modal = true;
      this.selectedKpi = this.trackingFlowService.getMiniKpiKeyOrValue('Validada', 'key');
    } else if (statusSelected == 'Entregada') {
      this.show_deliver_modal = true;
      this.selectedKpi = this.trackingFlowService.getMiniKpiKeyOrValue('Entregada', 'key');
    } else if (statusSelected == 'Pendiente') {
      this.citizen_modal = true;
      this.selectedKpi = this.trackingFlowService.getMiniKpiKeyOrValue('Pendiente', 'key');
    } else if (statusSelected == 'Aprobada') {
      this.show_approved_modal = true;
      this.selectedKpi = this.trackingFlowService.getMiniKpiKeyOrValue('Aprobada', 'key');
    } else if (statusSelected == 'Dictaminacion') {
      this.show_dictamine_modal = true;
      this.selectedKpi = this.trackingFlowService.getMiniKpiKeyOrValue('Dictaminacion', 'key');
    }
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getkpiDataList();
  }

  private changeInitialStatePending(): void {
    this.trackingFlowService.getKpiCountList(SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo), (data: any) => {
      data.pending.isActive = true;
      this.kpiList.set('pending', data.pending);
    }
    );
  }

  public onApplicationUpdate(event: any): void {
    // this enable the actual state filter and get new data
    this.configViewMiniKpi();

    // Pendiente-pending (*)
    if (event['modalName'] == 'pendientes') {
      this.trackingFlowService.getKpiCountList(
        SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
        (data: any) => {
          data.pending.isActive = true;
          this.kpiList.set('pending', data.pending);
        }
      );
      this.onKpiSelect('Pendiente');
    }
    // Validada-validated (*)
    if (event['modalName'] == 'validadas') {
      this.trackingFlowService.getKpiCountList(
        SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
        (data: any) => {
          data.validated.isActive = true;
          this.kpiList.set('validated', data.validated);
        }
      );
      this.onKpiSelect('Validada');
    }
    // En Dictaminacion-dictamination (*)
    if (event['modalName'] == 'dictaminadas') {
      this.trackingFlowService.getKpiCountList(
        SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
        (data: any) => {
          data.dictamination.isActive = true;
          this.kpiList.set('dictamination', data.dictamination);
        }
      );
      this.onKpiSelect('Dictaminacion');
    }
    // Aprobada-aproved (*)
    if (event['modalName'] == 'aprobadas') {
      this.trackingFlowService.getKpiCountList(
        SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo),
        (data: any) => {
          data.aproved.isActive = true;
          this.kpiList.set('aproved', data.aproved);
        }
      );
      this.onKpiSelect('Aprobada');
    }
    // Entregada-entered
    // Rechazada-rejected
  }

  public onHideModalClick(selectedKpi: string): void {
    switch (selectedKpi) {
      case 'pending':
        this.citizen_modal = false;
        break;
      case 'validated':
        this.show_validate_modal = false;
        break;
      case 'dictamination':
        this.show_dictamine_modal = !this.show_dictamine_modal
        break;
      case 'aproved':
        this.show_approved_modal = !this.show_approved_modal
        break;
      case 'entered':
        this.show_deliver_modal = !this.show_deliver_modal
        break;
      case '':
        this.show_rejected_list_modal = !this.show_rejected_list_modal
        break;
      default:
        console.log('');
    }
  }

  /****************************
   ********** EVENT ***********
   ****************************/

  public updateSelectedMunicipio(selecteMunicipio: string): void {
    this.selectedMunicipio = selecteMunicipio;
    this.isMnpFiltered = true;
    this.paginator = new PaginatorEntity();
    this.getApplicationListByStatus();
  }

  public onClearMunicipioFilter(): void {
    this.isMnpFiltered = false;
    this.selectedMunicipio = '-';
    this.paginator = new PaginatorEntity();
    this.getApplicationListByStatus();
  }

  public onClearFilter(): void {
    this.isFiltered = false;
    this.filterWord = '';
    this.getApplicationListByStatus();
  }

  /****************************
   ******* DATABASE ***********
   ****************************/

  private getkpiDataList(): void {
    this.spinner.show();
    this.getApplicationListByStatus();
  }

  private getMunicipioList(): void {
    this.catalogService.getMunicipioList('Guanajuato', list => {
      this.municipioList = list[0].municipios;
    })
  }

  public downloadZipByQ() {
    this.spinner.show();
    let selectedQ: string = 'Q1417';
    let folio: string = 'F2022Q141701002612';
    this.trackingFlowService.downloadZipByQ(selectedQ).subscribe((success: any) => {
      this.spinner.hide();
      var a = document.createElement("a");
      a.href = success["result"]["result"];
      a.click();
    },
      (error: any) => {
        // this.toastr.error("Hubo un error al descargar el archivo: ", error);
        this.spinner.hide();
      });;
  }
}
