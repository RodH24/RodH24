import { Component, OnInit } from '@angular/core';
import { PaginatorEntity } from '@app/data/entities';
import { VentanillaService } from '@app/data/services';
import { newVentanilla, Ventanilla } from '@app/data/types';

@Component({
  selector: 'app-office-panel',
  templateUrl: './office-panel.component.html',
  styleUrls: ['./office-panel.component.scss'],
})
export class OfficePanelComponent implements OnInit {
  public isEnabled: string = '';
  public filterWord: string = '';
  public isFiltered: boolean = false;
  public paginator: PaginatorEntity = new PaginatorEntity();
  public filteredWord: string = '';
  public ventanillaList: Array<any> = [];
  public isLoading: boolean = false;
  public selectedVentanilla: Ventanilla = newVentanilla;
  private deleteVentanilla: Ventanilla = newVentanilla;
  // Modales
  public showVentanillaModal: boolean = false;
  public showMapModal: boolean = false;
  public showSelectOfficeModal: boolean = false;
  public showDeleteModal: boolean = false;

  constructor(
    private ventanillaService: VentanillaService) {
  }

  ngOnInit(): void {
    this.geVentanillaList();
  }

  /****************************
   ******** EVENTS ************
  ****************************/

  public onUserFilter(filterWord: string): void {
    this.filteredWord = filterWord;
    this.geVentanillaList();
  }

  public onCreateVentanilla() {
    this.showVentanillaModal = true;
  }

  public onCloseModal(isRefresh: boolean): void {
    this.showMapModal = false;
    // this.showOfficeModal = false;
    // this.showSelectOfficeModal = false;
    this.showVentanillaModal = false;
    if (isRefresh) {
      this.geVentanillaList();
    }
  }

  public onOpenMap(ventanilla: Ventanilla): void {
    this.selectedVentanilla = ventanilla;
    this.showMapModal = true;
  }

  public onEdit(ventanilla: Ventanilla) {
    this.selectedVentanilla = ventanilla;
    this.showVentanillaModal = true;
  }

  public onDelete(data: Ventanilla) {
    this.showDeleteModal = true;
    this.deleteVentanilla = data;
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.geVentanillaList();
  }

  public onModalAccept(isAccept: boolean): void {
    this.showDeleteModal = false;
    if (isAccept && this.deleteVentanilla.clave !== '') {
      this.deleteOffice();
    }
  }

  /****************************
   ******* DATABASE ***********
   ****************************/

  private geVentanillaList(): void {
    this.isLoading = true;
    this.ventanillaService.list(
      this.paginator.page,
      true,
      null,
      null,
      null,
      this.filteredWord,
      (response: any) => {
        const { list, total } = response;
        this.ventanillaList = list;
        this.paginator.total = total;
        this.isLoading = false;
      }
    );
  }

  private deleteOffice() {
    this.ventanillaService.delete({
      clave: this.deleteVentanilla.clave,
      dependencia: this.deleteVentanilla.dependencia
    }, (isSuccess) => {
      this.deleteVentanilla = newVentanilla;
      if (isSuccess) {
        this.geVentanillaList();
      }
    });
  }

  /****************************
   ******* AUXILIAR ***********
   ****************************/

  public getOfficeStatus(habilitado: boolean | undefined): string {
    if (typeof habilitado === 'boolean') {
      return habilitado ? 'enabled' : 'disabled';
    }
    return 'undefined';
  }
























  /****************************
   ******** EVENTS ************
   ****************************/

  // public onOpenMap(office: Office): void {
  //   this.selectedOffice = office;
  //   this.showMapModal = true;
  // }

  // public onSelectFromList(office: Office = newOffice) {
  //   this.showSelectOfficeModal = true;
  // }

  // public onCreateVentanilla(id: string) {
  //   this.ventanillaOfficeId = id;
  //   this.showSelectOfficeModal = false;
  //   this.showVentanillaModal = true;
  // }

  // public onCreateOficina() {
  //   this.selectedOffice = newOffice;
  //   this.showOfficeModal = true;
  //   this.showSelectOfficeModal = false;
  // }

  // public onEdit(office: Office = newOffice) {
  //   this.selectedOffice = office;
  //   this.showOfficeModal = true;
  // }

  // public onDelete(clave: string) {
  //   this.showDeleteModal = true;
  //   this.deleteOfficeId = clave;
  // }


  /**
   * Handle the yes-no modal callback
   * Enabled/Disabled or delete
   */
  // public onModalAccept(isAccept: boolean): void {
  //   this.showDeleteModal = false;
  //   if (isAccept && this.deleteOfficeId !== '') {
  //     this.deleteOffice(this.deleteOfficeId);
  //   }
  // }


  /**
  * Filter office event
  * Calls the service to filter
  */
  // onOfficeFilter(): void {
  //   this.isFiltered = true;
  //   this.officeService.getOfficeListByWord(this.paginator.page, this.filterWord, ({ list, total }) => {
  //     this.officeList = list;
  //     this.paginator.total = total;
  //   });
  // }


  /**
   * Clear filter word and refresh program list
   */
  // onClearFilter(): void {
  //   this.isFiltered = false;
  //   this.filterWord = '';
  //   this.getOfficeList();
  // }


  /**
   * Change page event
   * @param {number} pageIndex Selected page
   */
  // public onIndexChange(pageIndex: number): void {
  //   this.paginator.pageIndex = pageIndex;
  //   this.getOfficeList();
  // }

  // /**
  //  * Update the list when the select controls value change
  //  */
  // public onSelectedStatusChange(): void {
  //   this.getOfficeList();
  // }

  /****************************
   ******* DATABASE ***********
   ****************************/

  // private getOfficeList(): void {
  //   this.officeService.getOfficeListByDependency(
  //     this.paginator.page,
  //     ({ list, total }) => {
  //       this.officeList = list;
  //       this.paginator.total = total;
  //     }
  //   );

  // }

  // public deleteOffice(clave: string) {
  //   this.officeService.delete(clave, (isSuccess) => {
  //     this.deleteOfficeId = '';
  //     if (isSuccess) {
  //       this.getOfficeList();
  //     }
  //   });
  // }


  /****************************
   ******* AUXILIAR ***********
   ****************************/

  // public getOfficeStatus(habilitado: boolean | undefined): string {
  //   if (typeof habilitado === 'boolean') {
  //     return habilitado ? 'enabled' : 'disabled';
  //   }
  //   return 'undefined';
  // }
}
