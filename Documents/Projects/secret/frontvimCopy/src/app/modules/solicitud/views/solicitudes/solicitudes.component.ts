import { Component, OnInit } from '@angular/core';
import { EncryptFunctions, RedirectionFunctions } from '@data/functions/';
import { Router } from '@angular/router';
import { NewProgram, ProgramType } from '@app/data/types';
import { ProgramService } from '@app/data/services';
import { PaginatorEntity, ApplicationStorageEntity } from '@app/data/entities';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss'],
})
export class SolicitudesComponent implements OnInit {
  public readonly targetList: Array<string> = [
    'Todas las poblaciones',
    'Mujeres',
    'Migrantes',
    'Jóvenes',
    'Adultos mayores de 65',
  ];
  public filterWord: string = '';
  public isFiltered: boolean = false;
  public programList: Array<ProgramType> = [];
  public selectedProgram: ProgramType = NewProgram;
  public paginator: PaginatorEntity = new PaginatorEntity();
  private applicationStorageEntity: ApplicationStorageEntity = new ApplicationStorageEntity();
  public showProgramDetailsModal: boolean = false;

  get selectedProgramDocuments(): Array<{
    nombre: string;
    tiposDocumentos: Array<string>;
  }> {
    const especificos = this.selectedProgram.modalidad?.anexos ?? [];
    const estandar = this.selectedProgram?.documentos ?? [];
    return [...especificos, ...estandar];
  }

  /**
   *
   * @param {} routing_request
   * @param programService
   */
  //** */
  constructor(
    public routing_request: Router,
    public programService: ProgramService
  ) { }

  ngOnInit(): void {
    this.applicationStorageEntity.clearAll();
    this.getProgramList();
  }


  /**
   * Calls service to get selected program details and show the program details modal
   * @param {string} programId Selected program id
   */
  public onShowDetailsClick(programId: string, clave: string | undefined, apoyo: string, type: string | undefined): void {
    // Here gets the type of the peu to define the flow and only changes for special peu
    if (type == environment.CONTROL_NEW_PEU_FLOW) {
      const encrypt = EncryptFunctions.encryptObj({ 'is_peu_special': true });
      sessionStorage.setItem('control_peu', encrypt);
    } else {
      const encrypt = EncryptFunctions.encryptObj({ 'is_peu_special': false });
      sessionStorage.setItem('control_peu', encrypt);
    }

    this.programService.get(programId, null, clave ?? null, apoyo, null, (data) => {
      this.selectedProgram = data ?? this.selectedProgram;
    });
    this.showProgramDetailsModal = true;
  }

  /**
   * Close program details modal event
   */
  public onCloseModal(): void {
    this.showProgramDetailsModal = false;
  }

  /**
   * Change page event
   * @param {number} pageIndex Selected page
   */
  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getProgramList();
  }

  /**
   * Handle apply event.
   * When clicks in the button save in local the selected program data
   * and redirects to the solicitud stepper
   */
  public onApply(): void {
    this.applicationStorageEntity.program = this.selectedProgram;
    RedirectionFunctions.redirectToReadCurp(this.routing_request);
  }

  /**
   * Filter program event
   * Calls the service to filter
   */
  onProgramFilter(): void {
    this.isFiltered = true;
    //page,isEnabled,isPeu,word,isFilter,type
    this.programService.list(
      this.paginator.page,
      true,
      null,
      this.filterWord,
      this.isFiltered,
      null,
      null,
      ({ list, total }: any) => {
        this.programList = list;
        this.paginator.total = total;
      });
  }

  /**
   * Clear filter word and refresh program list
   */
  onClearFilter(): void {
    this.isFiltered = false;
    this.filterWord = '';
    this.getProgramList();
  }

  /**
   * Format the tooltip text.
   * Concat all the options
   * @param {Array<string>} examples Array of all the options of the current document
   * @returns
   */
  public getDocumentDescription(examples: Array<string>): string | null {
    let description: string = '';
    if (examples && examples.length > 0) {
      for (let i = 0; i < examples?.length - 2; i++) {
        description += `${examples[i]}, \n`;
      }
      description += `${examples[examples?.length - 1]}`;
      return description;
    } else {
      return null;
    }
  }

  /**
   * Calls the service to get the paginated program list.
   * Returns the paginated list and the total records
   */
  private getProgramList(): void {
    //page,isEnabled,isPeu,word,isFilter,type
    this.programService.list(
      this.paginator.page,
      true,
      null,
      null,
      true,
      null,
      null,
      ({ list, total }: any) => {
        this.programList = list;
        this.paginator.total = total;
      })
  }
}
