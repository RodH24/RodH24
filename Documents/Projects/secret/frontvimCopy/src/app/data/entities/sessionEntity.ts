import { ApplicationStorageEntity } from "@data/entities";
import { PermissionType, roleType, DateRangeType, DateType } from "@data/types";
import { DateFunctions } from "@data/functions";
import * as moment from "moment";

export class SessionEntity {
  private activeRole: roleType = <roleType>{};
  private permissions: PermissionType = {};
  private permissionsObj: Array<any> = [{}];
  private applicationStorageEntity = new ApplicationStorageEntity();
  private viewingDate: DateType = null;

  constructor() {
    this.updateSessionEntity();
  }

  /***************************** PERMISSIONS DATA *****************************/
  set setPermissionsData(permissionsObj: any) {
    this.applicationStorageEntity.saveSessionPermissions(
      JSON.stringify(permissionsObj)
    );
    this.updateSessionEntity();
  }

  
  /******************************* VIEWING DATE *******************************/
  get getViewingDate(): DateType {
    return this.viewingDate === "" ? null : this.viewingDate;
  }

  set setViewingDate(viewingDate: DateType) {
    this.applicationStorageEntity.saveSessionViewingDate(viewingDate);
    this.viewingDate =
      viewingDate === null || viewingDate === "" ? null : viewingDate;
  }



  /**********************************************
   ************* GETTERS GENERAL ****************
   * ********************************************
   */
  get permissionListFromLocalStorage() {
    return this.applicationStorageEntity.getSessionPermissions();
  }

  // get decodedValue(): string {
  //   return decode(this.token);
  // }

  get permissionsList(): any {
    return this.permissions;
  }

  get permissionsObjList(): any {
    return this.permissionsObj;
  }

  

  get viewingYear(): number {
    return DateFunctions.getYear(this.viewingDate);
  }

  get getActiveRole(): any {
    return this.activeRole;
  }
  /*
    get getTokenValue(): string {
      return this.getLocalStorageSessionRoles()
    }
  
    get userData(): any {
      return this.getUserData();
    }
  */
  get activeRol(): any {
    return this.activeRole;
  }

  get ActiveRolId(): string {
    return this.activeRole?.id;
  }

  get isAdminRol(): boolean {
    return this.activeRole?.key == "ADMIN_ROL" ? true : false;
  }

  get supportTypeList(): Array<any> {
    return this.getSupportTypeList();
  }

  /*******************
   * P R O G R A M S *
   *******************/
  get Qlist(): Array<any> {
    return this.getQlist();
  }

  get roleHasClavesQ(): boolean {
    return this.hasClavesQ();
  }
  /***************
   * A P O Y O S *
   ***************/
  get suportList(): Array<any> {
    return this.getSuportList();
  }
  get roleHasSupports(): boolean {
    return this.hasSupports();
  }
  /***************
   * D E P E N D E N C Y *
   ***************/

  get roleHasDependencias(): boolean {
    return this.hasDependencias();
  }
  get roleHasRegiones(): boolean {
    return this.hasRegiones();
  }

  /************************************************
   ************* F U N C T I O N S ****************
   ************************************************
   */

  private getSuportList() {
    let actualRol = this.activeRole;
    let suportList = actualRol.apoyos;
    return suportList;
  }

  private transformClaveQFromTipoApoyo(tipoApoyo: any) {
    tipoApoyo.clave = tipoApoyo.clave.split("-")[0];
    tipoApoyo.name = "";
    return tipoApoyo;
  }

  private getQlist() {
    let actualRol = this.activeRole;
    let arrayQs: Array<any> = [];
    let arrayTipos = actualRol.apoyos;

    for (let m in arrayTipos) {
      if (arrayTipos[m].clave != "-") {
        arrayQs.push(this.transformClaveQFromTipoApoyo(arrayTipos[m]));
      }
    }
    return arrayQs;
  }

  private getSupportTypeList() {
    let actualRol = this.activeRole;
    return actualRol.apoyos;
  }

  private hasDependencias() {
    let actualRol = this.activeRole;
    if ("dependencias" in actualRol) {
      return true;
    } else {
      return false;
    }
  }

  private hasClavesQ() {
    let actualRol = this.activeRole;
    if ("apoyos" in actualRol) {
      return true;
    } else {
      return false;
    }
  }

  private hasSupports() {
    let actualRol = this.activeRole;
    if ("apoyos" in actualRol) {
      return true;
    } else {
      return false;
    }
  }
  private hasRegiones() {
    let actualRol = this.activeRole;
    if ("regiones" in actualRol) {
      return true;
    } else {
      return false;
    }
  }

  /*
    private existsActiveRole() {
      let decodedToken = this.getLocalStorageSessionRoles();
      let roles = decodedToken.roles;
      let active_rol = roles.some((value: any) => value.hasOwnProperty('active'));
      return active_rol
    }
  
    private getUserData(): any {
      let decodedToken = this.getLocalStorageSessionRoles();
      let userData = {
        name: decodedToken.name,
        email: decodedToken.email,
        dependency: decodedToken.dependency,
        office: decodedToken.office,
      }
      return userData
    }
  */
  private updateSessionEntity() {
    let descryptedPermissions = JSON.parse(
      this.applicationStorageEntity.getSessionPermissions()
    );
    this.viewingDate = this.applicationStorageEntity.getSessionViewingDate();
    if (descryptedPermissions) {
      this.permissionsObj = descryptedPermissions.permissions;
      this.permissionsObj =
        new Date().getFullYear() > 2022
          ? this.permissionsObj.filter(
              (permission: any) =>
                permission._id != "n2_firmaAcuse_c6a6372f31bd" &&
                permission._id != "n2_reimpresion_73536caf5bce"
            )
          : this.permissionsObj;
      if (this.permissionsObj) {
        for (let key of this.permissionsObj) {
          if (key?._id) {
            this.permissions[key?._id] = true;
          }
        }
        let role = descryptedPermissions?.activeRole;
        this.activeRole = <roleType>role;
      }
    }
  }

  public logOut(): void {
    sessionStorage.clear();
  }
}
