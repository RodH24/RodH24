import { Component, EventEmitter, OnInit } from "@angular/core";
import { ProgramType } from "@data/types";
import { ProgramService } from "@data/services";
import {
  TokenEntity,
  PaginatorEntity,
  SessionEntity,
} from "@app/data/entities";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-program-panel",
  templateUrl: "./program-panel.component.html",
  styleUrls: ["./program-panel.component.scss"],
})
export class ProgramPanelComponent implements OnInit {
  // Entidades
  public token: TokenEntity;
  public paginator: PaginatorEntity = new PaginatorEntity();
  //
  // Informacion para mostrar
  public programList: Array<ProgramType> = [];
  // Auxiliar
  public isProgramEnabled: boolean | null | string = "null";
  public filterTerm: string = "";
  // Controla la visibilidad de los elementos
  public showProgramModal: boolean = false;
  public showDetailsModal: boolean = false;
  public confirmModalType: "pause" | "delete" = "pause";
  public showConfirmModal: boolean = false;
  public confirmModalTitle: string = "";
  public confirmModalMsg: string = "";
  public isEnabled: boolean = true;
  public isTableLoading: boolean = false;
  public selectedProgram: { programId: string; clave: string } = {
    programId: "",
    clave: "",
  };
  public session = new SessionEntity();;
  public permissions;

  constructor(
    private cookieService: CookieService,
    private programService: ProgramService
  ) {
    this.permissions = this.session.permissionsList;
    this.token = new TokenEntity(this.cookieService);
    
  }

  ngOnInit(): void {
    this.getProgramList();
  }

  /*******************************
   ********** EVENTS **************
   ********************************/

  onCreate(): void {
    this.selectedProgram = { programId: "", clave: "" };
    this.showProgramModal = true;
  }

  onEdit(program: ProgramType): void {
    this.selectedProgram = {
      programId: program.programa._id,
      clave: program.programa.clave,
    };
    this.showProgramModal = true;
  }

  onProgramEdit(isRefresh: any): void {
    this.showProgramModal = false;
    if (isRefresh) {
      this.getProgramList();
    }
  }

  onDelete(program: ProgramType): void {
    this.selectedProgram = {
      programId: program.programa._id,
      clave: program.programa.clave,
    };
    this.confirmModalType = "delete";
    this.showConfirmModal = true;
    this.confirmModalTitle = "Eliminar el programa";
    this.confirmModalMsg = "¿Seguro que quiere ELIMINAR el programa?";
  }

  /**
   * Handle change status button's click event
   * Call to the service and update the list
   * @param {string} id selected program id
   * @param {boolean} newStatus new status to set
   */
  onUpdateStatus(id: string, clave: string, isEnabled: boolean) {
    this.showConfirmModal = true;
    this.isEnabled = isEnabled;
    this.selectedProgram = { programId: id, clave: clave };
    if (isEnabled) {
      this.confirmModalTitle = "Habilitar programa";
      this.confirmModalMsg = "¿Seguro que quiere habilitar el programa?";
    } else {
      this.confirmModalTitle = "Dehabilitar programa";
      this.confirmModalMsg = "¿Seguro que quiere deshabilitar el programa?";
    }
  }

  /**
   * Update the list when the select controls value change
   */
  public onSelectedStatusChange(): void {
    this.getProgramList();
  }

  public onTagsChange(id: string, clave: string, tags: EventEmitter<any[]>) {
    this.programService.updateTags(
      id,
      clave,
      tags as any,
      null,
      (isSuccess) => {}
    );
  }

  /**
   * Handle the yes-no modal callback
   * Enabled/Disabled or delete
   */
  public onModalAccept(isAccept: boolean): void {
    this.showConfirmModal = false;
    if (isAccept) {
      if (this.confirmModalType === "pause") {
        this.updateStatus();
      } else if (this.confirmModalType === "delete") {
        this.delete();
      }
    }
  }

  /**
   * Change page event
   * @param {number} pageIndex Selected page
   */
  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getProgramList();
  }

  /*******************************
   ********** AUXILIAR **************
   ********************************/

  public getProgramStatus(habilitado: boolean | undefined): string {
    if (typeof habilitado === "boolean") {
      return habilitado ? "enabled" : "disabled";
    }
    return "undefined";
  }

  /**********************************
   *********** DATABASE *************
   **********************************/

  /**
   * Call the program service to fill list
   */
  private getProgramList() {
    this.selectedProgram = { programId: "", clave: "" };
    if (this.isProgramEnabled !== "null") {
      if (this.isProgramEnabled === "true") {
        //page,isEnabled,isPeu,word,isFilter,type
        this.programService.list(
          this.paginator.page,
          true,
          null,
          null,
          true,
          "claveQ",
          null,
          ({ list, total }: any) => {
            this.programList = list;
            this.paginator.total = total;
          }
        );
      } else {
        this.programService.list(
          this.paginator.page,
          false,
          null,
          null,
          true,
          "claveQ",
          null,
          ({ list, total }: any) => {
            this.programList = list;
            this.paginator.total = total;
          }
        );
      }
    } else {
      this.programService.list(
        this.paginator.page,
        null,
        null,
        null,
        true,
        "claveQ",
        null,
        ({ list, total }: any) => {
          this.programList = list;
          this.paginator.total = total;
        }
      );
    }
  }

  private updateStatus() {
    const { programId } = this.selectedProgram;
    this.programService.updateStatus(programId, this.isEnabled, (isSuccess) => {
      if (isSuccess) {
        this.getProgramList();
      }
    });
  }

  private delete() {
    const { programId } = this.selectedProgram;
    this.programService.delete(programId, (isSuccess) => {
      if (isSuccess) {
        this.getProgramList();
      }
    });
  }
}
