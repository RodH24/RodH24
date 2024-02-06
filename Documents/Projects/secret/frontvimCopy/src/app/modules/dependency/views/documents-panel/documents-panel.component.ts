import { Component, OnInit } from '@angular/core';
import { PaginatorEntity, TokenEntity } from '@app/data/entities';
import { ApplicationService, TrackingFlowService } from '@app/data/services';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-documents-panel',
  templateUrl: './documents-panel.component.html',
  styleUrls: ['./documents-panel.component.scss'],
})
export class DocumentsPanelComponent implements OnInit {
  public token: TokenEntity;
  public paginator: PaginatorEntity = new PaginatorEntity();
  // This shows the list of cards shown on the dashboard
  public cardList: Array<any> = [];
  // Show/Hide modal
  public showModal: boolean = false;
  //
  public selectedCard: any = {};

  // For filtering cards 
  public term: string = '';
  public isFiltered: boolean = false;
  public selectedStatus: string = '';

  constructor(
    private cookieService: CookieService,
    public spinner: NgxSpinnerService,
    private applicationService: ApplicationService
  ) {
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
    this.getApplicationList();
  }

  /*****************************
   ************ EVENT **********
   *****************************/

  public onCardClick(data: any): void {
    this.selectedCard = data;
    this.showModal = true;
  }

  /**
   * Paginator change page event
   * @param {number} pageIndex page to go
   */
  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getApplicationList();
  }

  public onCloseModal(isRefresh: boolean): void {
    this.showModal = false;
    if (isRefresh) {
      this.getApplicationList();
    }
  }

  /*****************************
   ********** DATABASE *********
   *****************************/

  private getApplicationList() {
    this.spinner.show();
    this.applicationService.listSolicitud(
      this.paginator.page,
      'En observación',
      'All',
      this.term.length ? this.term : null,
      null,
      null,
      ({ list, total }) => {
        this.cardList = list;
        this.paginator.total = total;
        this.spinner.hide();
      }
    );
  }


  /***********************************
   ********** FILTER BY WORD *********
   ***********************************/
  public onClearFilter(): void {
    this.isFiltered = false;
    this.term = '';
    this.getApplicationList();
  }


  public onSolicitudFilter() {
    this.isFiltered = true;
    this.getApplicationList();
  }
}
