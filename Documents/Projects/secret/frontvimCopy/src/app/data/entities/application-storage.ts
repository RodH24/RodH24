import { Cookies, LocalStorage } from "../constants/cookies";
import { EncryptFunctions, SolicitudFunctions } from "../functions";
import { DateType } from "@data/types";

export class ApplicationStorageEntity {
  private initialSolicitud = {
    tipoSolicitud: "Ciudadana",
    origen: "",
    tutor: {
      respuesta: false,
    },
  };

  private initialCedula = {
    solicitudImpulso: true,
    cedulaImpulso: true,
  };

  private initialDocuments = {
    standar: [],
    especifico: [],
  };

  constructor() {}

  // This changes the origin creation depending on the type of program
  public setNewBaseOrigin(data: any) {
    this.solicitud = { ...this.solicitud, ...data };
  }

  /** Getter from local storage */
  get cedula(): any {
    const local = sessionStorage.getItem(Cookies.cedulaDataCookie);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialCedula;
  }

  /** Getter from local storage */
  get solicitud(): any {
    const local = sessionStorage.getItem(Cookies.solicitudDataCookie);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialSolicitud;
  }

  get curp(): any {
    const local = sessionStorage.getItem(Cookies.curpDataCookie);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return {};
  }

  /** Getter from local storage */
  get program(): any {
    const local = sessionStorage.getItem(Cookies.programDataCookie);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return null;
  }

  /** Setter to local storage */
  get documents(): any {
    const local = sessionStorage.getItem(Cookies.documentsDataCookie);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialDocuments;
  }

  get originalSolicitud(): any {
    const local = sessionStorage.getItem(Cookies.originalSolicitud);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialSolicitud;
  }

  get originalCedula(): any {
    const local = sessionStorage.getItem(Cookies.originalCedula);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialCedula;
  }

  get originalDocuments(): any {
    const local = sessionStorage.getItem(Cookies.originalDocumentos);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return this.initialDocuments;
  }

  get solicitudDifferences(): any {
    return SolicitudFunctions.getDifferences(
      this.originalSolicitud,
      this.solicitud
    );
  }

  get cedulaDifferences(): any {
    const differences = SolicitudFunctions.getDifferences(
      this.originalCedula,
      this.cedula
    );
    if (differences) differences.datosGasto = this.cedula?.datosGasto;
    return differences;
  }

  get editFolio(): string {
    const local = sessionStorage.getItem(Cookies.editFolio);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return "";
  }

  set editFolio(value: string) {
    const encrypt = EncryptFunctions.encryptObj(value);
    sessionStorage.setItem(Cookies.editFolio, encrypt);
  }

  /** Setter to local storage */
  set cedula(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.cedulaDataCookie, encrypt);
  }

  /** Setter to local storage */
  set solicitud(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.solicitudDataCookie, encrypt);
  }

  /** Setter to local storage */
  set curp(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.curpDataCookie, encrypt);
  }

  /** Setter to local storage */
  set program(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.programDataCookie, encrypt);
  }

  /** Setter to local storage */
  set documents(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.documentsDataCookie, encrypt);
  }

  set originalAndCopySolicitud(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalSolicitud, encrypt);
    sessionStorage.setItem(Cookies.solicitudDataCookie, encrypt);
  }

  set originalAndCopyCedula(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalCedula, encrypt);
    sessionStorage.setItem(Cookies.cedulaDataCookie, encrypt);
  }

  set originalAndCopyDocumentos(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalDocumentos, encrypt);
    sessionStorage.setItem(Cookies.documentsDataCookie, encrypt);
  }

  set originalSolicitud(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalSolicitud, encrypt);
  }

  set originalCedula(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalCedula, encrypt);
  }

  set originalDocumentos(data: any) {
    const encrypt = EncryptFunctions.encryptObj(data);
    sessionStorage.setItem(Cookies.originalDocumentos, encrypt);
  }

  /**
   * clear from local storage
   */
  public clearAll() {
    sessionStorage.removeItem(Cookies.cedulaDataCookie);
    sessionStorage.removeItem(Cookies.programDataCookie);
    sessionStorage.removeItem(Cookies.solicitudDataCookie);
    sessionStorage.removeItem(Cookies.documentsDataCookie);
    sessionStorage.removeItem(Cookies.curpDataCookie);
    sessionStorage.removeItem(Cookies.editFolio);
  }

  public clearCedula(): void {
    sessionStorage.removeItem(Cookies.cedulaDataCookie);
  }

  public clearProgram(): void {
    sessionStorage.removeItem(Cookies.programDataCookie);
  }

  public clearSolicitud(): void {
    sessionStorage.removeItem(Cookies.solicitudDataCookie);
  }

  /************************************************************
   **************** S E S S I O N - E N T I T Y ***************
   ************************************************************/

  // S  E  S  S  I  O  N
  public saveSessionPermissions(permissions: any): void {
    const encryptedData = EncryptFunctions.encryptObj(permissions);
    sessionStorage.setItem(LocalStorage.SESSION_PERMISSIONS, encryptedData);
  }
  public getSessionPermissions() {
    const local = sessionStorage.getItem(LocalStorage.SESSION_PERMISSIONS);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return null;
  }
  public deletePermissions(): void {
    sessionStorage.removeItem(LocalStorage.SESSION_PERMISSIONS);
  }

  // R  O  L  E  S
  public saveSessionRoles(roles: string): void {
    const encryptedData = EncryptFunctions.encryptObj(roles);
    sessionStorage.setItem(LocalStorage.SESSION_ROLES, encryptedData);
  }
  public getSessionRoles() {
    const local = sessionStorage.getItem(LocalStorage.SESSION_ROLES);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return null;
  }
  public deleteRoles(): void {
    sessionStorage.removeItem(LocalStorage.SESSION_ROLES);
  }

  // V I E W I N G D A T E
  public saveSessionViewingDate(viewingDate: DateType): void {
    viewingDate = viewingDate === null ? "" : viewingDate;
    const encryptedData = EncryptFunctions.encryptObj(viewingDate);
    sessionStorage.setItem(LocalStorage.SESSION_VIEWINGDATE, encryptedData);
  }

  public getSessionViewingDate(): DateType {
    const local = sessionStorage.getItem(LocalStorage.SESSION_VIEWINGDATE);
    if (local) {
      return EncryptFunctions.decryptObj(local);
    }
    return null;
  }
}
