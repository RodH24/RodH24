import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OfficeService } from '@app/data/services';
import { PaginatorEntity } from '@app/data/entities';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-office-select-modal',
  templateUrl: './office-select-modal.component.html',
  styleUrls: ['./office-select-modal.component.scss'],
})
export class OfficeSelectModalComponent implements OnInit {
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onAddVentanillaModal: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() onAddOficinaModal: EventEmitter<void> = new EventEmitter<void>();
  //
  public paginator: PaginatorEntity = new PaginatorEntity();
  public list: Array<any> = [];
  public cp: string = '';
  // Show/hide elements
  public isLoadingCpData = false;

  get isValidCp(): boolean {
    const reg = /^(3[6-8])([0-9]{3})$/;
    return this.cp.length == 5 && !isNaN(+this.cp) && reg.test(this.cp);
  }

  constructor(
    private officeService: OfficeService,
    private cookieService: CookieService
  ) {
  }

  ngOnInit(): void {
  }

  /****************************
   ******** EVENTS ************
   ****************************/
  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

  public onGetCpData(event: any): void {
    if (this.isValidCp) {
      this.getOfficeListByCp();
    } else {
      this.list = [];
    }
  }

  /**
   * Change page event
   * @param {number} pageIndex Selected page
   */
  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getOfficeListByCp();
  }

  public onAddVentanilla(officeId: string): void {
    this.onAddVentanillaModal.emit(officeId);
  }

  public onAddOficina(): void {
    this.onAddOficinaModal.emit();
  }

  /****************************
   ******** DATABASE **********
   ****************************/
  public getOfficeListByCp() {
    this.officeService.getOfficeByCp(
      this.paginator.page,
      this.cp,
      ({ list, total }) => {
        this.list = list.filter((value,index)=>
                            {return list.map(function(e) { return e._id; }).indexOf(value._id)=== index;  });
        this.paginator.total = total;
      }
    );
  }
}
