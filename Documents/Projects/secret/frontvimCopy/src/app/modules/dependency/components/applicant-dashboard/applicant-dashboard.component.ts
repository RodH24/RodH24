import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MiniKpiClassType } from '@data/types/MiniKpi';
import { PaginationType, ApplicationType } from '@data/types';

@Component({
  selector: 'app-applicant-dashboard',
  templateUrl: './applicant-dashboard.component.html',
  styleUrls: ['./applicant-dashboard.component.scss'],
})
export class ApplicantDashboardComponent implements OnInit {
  @Input() applicationList: Array<ApplicationType> = [];
  /** Mini Kpi Components Array to show and control events */
  @Input() kpiList: Map<string, MiniKpiClassType> = new Map();
  /** */
  @Output() detailsButtonClickEvent: EventEmitter<string> =
    new EventEmitter<string>();
  /** */
  @Output() kpiClickEvent: EventEmitter<string> = new EventEmitter<string>();
  /** Input filter term */
  public term: any = '';

  /** To control pagination */
  public pagination: PaginationType = {
    startIndex: 0,
    pageSize: 9,
  };

  constructor() {}

  ngOnInit(): void {
  }

  /**
   * Mini Kpi select event.
   * Change the 'isActive', property of other kpi.
   * Just one can be selected at time.
   * @param {string} kpiType : Type of the selected kpi. This is for filter.
   * @public
   */
  public onKpiSelect(kpiType: string): void {
    /** This variable is created to avoid multiple refresh of the object */
    const kpiList = this.kpiList;
    for (const [key, mapElementData] of kpiList) {
      mapElementData.isActive = mapElementData.type === kpiType;
      kpiList.set(key, mapElementData);
    }
    this.kpiClickEvent.emit(kpiType);
  }

  /** Front pagination (this will be deleted) */
  onPageIndexChange(pageIndex: number): void {
    pageIndex = pageIndex - 1;
    let serie_limites = [];
    let cantidad_registros = this.applicationList.length;
    let secciones =
      Math.round(cantidad_registros / this.pagination.pageSize) + 1;
    let contador = 0;

    for (let m = 0; m < secciones; m++) {
      if (m == 0) {
        serie_limites.push({
          inferior: 0,
          superior: contador + this.pagination.pageSize,
        });
        contador = contador + this.pagination.pageSize;
      } else {
        serie_limites.push({
          inferior: contador,
          superior: contador + this.pagination.pageSize,
        });
        contador = contador + this.pagination.pageSize;
      }
    }
    this.pagination.startIndex = serie_limites[pageIndex]['inferior'];
  }

  /**
   * Applicant card click event. 
   * Emit the id to show the modal and fill it
   */
   public onApplicantCardClick(applicantId: string) {
    this.detailsButtonClickEvent.emit(applicantId);
  }

  onTopNavigation(evento: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
