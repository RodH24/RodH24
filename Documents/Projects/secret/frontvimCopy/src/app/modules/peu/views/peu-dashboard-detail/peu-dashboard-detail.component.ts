import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import * as XLSX from "xlsx";
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { PeuService } from '@data/services';
import { EncryptFunctions } from '@app/data/functions';
import { MiniKpiDetailModality } from '@app/data/types';

@Component({
  selector: 'peu-dashboard-detail',
  templateUrl: './peu-dashboard-detail.component.html',
  styleUrls: ['./peu-dashboard-detail.component.scss'],
})
export class PeuDashboardDetailComponent implements OnInit {
  public historicSupportList: any = [];
  public filterTerm: string = '';
  public modalData: any = {};
  public showDetailsModal: boolean = false;
  public showAddDetailModal: boolean = false;
  public isVisibleDump: boolean = false;
  public received_data: any;
  public kpi_card_list: Array<MiniKpiDetailModality> = [
    {
      title: 'Mujeres Apoyadas',
      count: 0,
      color: 'pink',
      imageUrl: 'woman.png',
    },
    {
      title: 'Hombres Apoyados',
      count: 0,
      color: 'blue',
      imageUrl: 'man.png',
    },
    {
      title: 'Municipios Apoyados',
      count: 0,
      color: 'yellow',
      imageUrl: 'guanajuato.png',
    },
    {
      title: 'Monto',
      count: 0,
      color: 'green',
      isMoney: true,
      imageUrl: 'money.png',
    },
  ];
  public inputDetailModal: any;
  public filter_date: any;

  constructor(private peuService: PeuService, private router: Router) {

  }

  ngOnInit(): void {
    this.recoverDataFronLocalStorage();
    this.getDetailSupportType();
    this.fillMiniKPisData();
  }
  public recoverDataFronLocalStorage(): void {
    const local = sessionStorage.getItem('_');
    if (local) {
      this.received_data = EncryptFunctions.decryptObj(local);
    }
  }
  public goBack(): void {
    this.router.navigate(['peu/panel']);
  }
  public fillMiniKPisData(): void {
    const modality = this.received_data['apoyo']['clave'];
    // Benefesaries count
    this.peuService.getMiniKpiIndicators(modality, (response: any) => {
      for (let m of this.kpi_card_list) {
        if (m['title'] == 'Mujeres Apoyadas') {
          m['count'] = response['total_women']
        }
        if (m['title'] == 'Hombres Apoyados') {
          m['count'] = response['total_men']
        }
      }
    });

    // Municipalities data 
    this.peuService.getMunicipalitiesByModality(modality, (response: any) => {
      for (let m of this.kpi_card_list) {
        if (m['title'] == 'Municipios Apoyados') {
          m['count'] = response['count']
        }
      }
    });

  }
  public controladdDetailModal(event: any = this.received_data): void {
    this.showAddDetailModal = !this.showAddDetailModal;
    this.getDetailSupportType();
    this.fillMiniKPisData();
  }
  public getDetailSupportType(): void {
    const supportType = this.received_data['apoyo']['clave'];
    this.peuService.getDetailSupportType(supportType, (response: any) => {
      this.historicSupportList = response;
      let total = 0.0;

      for (let m of response) {
        total = total + parseFloat(m['monto'])
      }

      for (let m of this.kpi_card_list) {
        if (m['title'] == 'Monto') {
          m['count'] = total
        }
      }
    });
  }
  public exportData(data: any): void {
    let codigo = data['dependencia']['codigo'];
    let data_to_export = [];
    let obj_to_export = {
      "nombre": data['lugar']['nombre'],
      "modalidad": data['programa']['modalidad']['nombre'],
      "monto": data['monto'],
      "mujeres_apoyadas": data['totalBeneficiarios']['mujeres'],
      "hombres_apoyados": data['totalBeneficiarios']['hombres'],
      "total_apoyados": parseInt(data['totalBeneficiarios']['mujeres']) + parseInt(data['totalBeneficiarios']['hombres']),
    };

    data_to_export.push(obj_to_export)

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data_to_export);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    XLSX.writeFile(wb, 'reporte' + codigo + '.xlsx');
  }
  public showDetailModal(event: any = this.received_data): void {
    // define data to the input value for the modal
    this.inputDetailModal = event;
    // show or hide modal 
    this.showDetailsModal = !this.showDetailsModal;
  }
  public onCloseDetailModalEvent(event: any): void {
    this.showDetailsModal = !this.showDetailsModal;
  }
  public onChange(dates: any): void {
    const modality = this.received_data['apoyo']['clave'];
    this.peuService.getDetailListByDatesAndModalities(modality, dates[0].toISOString(), dates[1].toISOString(), (response: any) => {
      this.historicSupportList = response;
      let total = 0.0;

      for (let m of response) {
        total = total + parseFloat(m['monto'])
      }

      for (let m of this.kpi_card_list) {
        if (m['title'] == 'Monto') {
          m['count'] = total
        }
      }
    });

  }



  public handleCancelDump(): void {
    this.isVisibleDump = !this.isVisibleDump;
  }
}
