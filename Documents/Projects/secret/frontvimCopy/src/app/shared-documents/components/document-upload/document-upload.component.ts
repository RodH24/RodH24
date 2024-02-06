import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ApplicationStorageEntity, SessionEntity } from "@app/data/entities";
import { SolicitudFunctions } from "@app/data/functions";
import { ApplicationService } from "@app/data/services";
import { NewProgram, ProgramType, DocumentType } from "@app/data/types";
import { ToastrService } from "ngx-toastr";
import { differenceInCalendarDays } from "date-fns";
import { NOMEM } from "dns";

@Component({
  selector: "app-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.scss"],
})
export class DocumentUploadComponent implements OnInit {
  @Input() programData: ProgramType = NewProgram;
  @Input() isUpdate: boolean = false;
  @Input() fechaCaptura: any = "";
  @Input() editFolio: string = "";
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  //
  private sessionEntity = new SessionEntity();
  private vigencia:
    | { startDate: string | null; endDate: string | null }
    | string
    | null = this.sessionEntity.getViewingDate;
  public vigenciaAnio: number = this.sessionEntity.viewingYear;
  //
  public showFileMOdal: boolean = false;
  public largeFiles: Array<any> = [];
  public actualSumWeight: number = 0;
  public limitWeight: number = 16777216; //16MB
  private documents: any = {};
  private applicationStorageEntity = new ApplicationStorageEntity();
  public activeCommentIndex: {
    [type: string]: Array<number>;
  } = {
    estandar: [],
    especifico: [],
  };
  public pdfOrigin =
    "https://ventanillaimpulso.s3.amazonaws.com/DEV/HEVD950613MGTRLN04/Expediente/Estandar/1642193199892_Inducci%C3%B3n%20a%20la%20SFIA_Evaluaci%C3%B3n%20de%20Satisfacci%C3%B3n.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA54WQAS56WGYSXW5V%2F20220114%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220114T224940Z&X-Amz-Expires=600&X-Amz-Signature=34b1eddb72cbd0bba33d10c40b5df380a30677fb6b3575ae9f85fa18ef35fb68&X-Amz-SignedHeaders=host";
  public files: {
    // [key: string]: { [key: string]: File };
    [type: string]: {
      [fileName: string]: {
        fechaVigencia: any;
        file: File;
      };
    };
  } = {
    estandar: {},
    especifico: {},
  };

  /**
   * Get the program specific document list from program data
   * @returns Array
   */
  get programDocuments(): Array<DocumentType> {
    return this.programData?.modalidad?.anexos ?? [];
  }

  /**
   * Get the program standard document list from program data
   * @returns Array
   */
  get standardDocuments(): Array<any> {
    const solicitud = this.applicationStorageEntity.solicitud;
    const documents = this.programData?.documentos ?? [];
    if (
      solicitud.datosCurp &&
      "folioImpulso" in solicitud.datosCurp &&
      solicitud.datosCurp.folioImpulso &&
      solicitud.datosCurp.folioImpulso.length > 0 &&
      this.vigenciaAnio >= 2023
    ) {
      let count = 0;
      for (let item of documents) {
        if (item.nombre === "Identificación Oficial Vigente con Fotografía") {
          documents.splice(count, 1);
        }
        count++;
      }
    }

    if (!this.editFolio && !this.isUpdate) {
      let count = 0;
      for (let item of documents) {
        if (item.nombre === "Solicitud") {
          documents.splice(count, 1);
        }
        count++;
      }
    }
    return documents ?? [];
  }

  get solicitudStandardDocuments(): Array<any> {
    return this.documents.estandar;
  }

  get solicitudProgramDocuments(): Array<any> {
    return this.documents.especifico;
  }

  constructor(
    private toastr: ToastrService,
    private applicationService: ApplicationService
  ) {
    this.documents = this.applicationStorageEntity.documents;
    this.getDocumentUrl();
  }

  ngOnInit(): void {
    this.fechaCaptura = this.fechaCaptura ? new Date(this.fechaCaptura) : "";
  }

  public createCommentIndex(type: string, documents: Array<any>): void {
    const newArray = Array(documents.length);
    newArray.fill(0);
    this.activeCommentIndex[type] = newArray;
  }

  public disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    const dateRight =
      this.fechaCaptura === "" ? new Date() : new Date(this.fechaCaptura);
    return differenceInCalendarDays(current, dateRight) < 0;
  };

  /********************************
   ******* GET DOCUMENT DATA ******
   ******* TEMPLATE CONTROL *******
   ********************************/

  /**
   *
   * @param {string} type Document type: estandar / especifico
   * @param {string} key Document name
   * @returns {boolean} ifFile exists in the solicitud
   */
  public fileExists(type: string, key: string): boolean {
    const documents = this.getSolicitudDocumentListByType(type);
    if (documents) {
      return key in documents;
    }
    return false;
  }

  /**
   *
   * @param {string} type Document type: estandar / especifico
   * @param {string} key Document name
   * @returns {string} file url
   */
  public getFileUrl(type: string, key: string): string {
    const documents = this.getSolicitudDocumentListByType(type);
    return documents[key].signedUrl;
  }

  public getDocumentListByType(type: string): Array<DocumentType> {
    const documents =
      type === "estandar" ? this.standardDocuments : this.programDocuments;
    if (this.activeCommentIndex[type].length === 0) {
      this.createCommentIndex(type, documents);
    }
    return documents;
  }

  public getSolicitudDocumentListByType(type: string): any {
    return type === "estandar"
      ? this.solicitudStandardDocuments
      : this.solicitudProgramDocuments;
  }

  /**
   * Get the documents type, to control ngfor in template
   * @returns Array
   */
  get documentsType(): Array<string> {
    return ["estandar", "especifico"];
  }

  public getDocumentComments(
    type: string,
    key: string
  ): Array<{
    comentario: string;
    fecha: string;
    usuario: string;
  }> {
    const documents = this.getSolicitudDocumentListByType(type) as any;
    const observaciones = documents[key]?.observaciones;
    return observaciones.reverse();
  }

  public showDocument(type: string, key: string): boolean {
    if (this.isUpdate) {
      return !this.isDocumentHabilitado(type, key);
    }
    return true;
  }

  public isDocumentHabilitado(type: string, key: string): boolean {
    const documents = this.getSolicitudDocumentListByType(type) as any;
    if (key in documents && "habilitado" in documents[key]) {
      return documents[key]?.habilitado;
    }
    return true;
  }

  /********************************
   ************ EVENTS *************
   *********************************/

  public onBoxSelect(
    e: any,
    type: string = "estandar",
    key: string,
    isSolicitudFileSelected: boolean
  ) {
    const parent = e.target.parentElement;
    parent.classList.add("selected");
    const sibling = parent.previousElementSibling ?? parent.nextElementSibling;
    sibling.classList.remove("selected");
    this.documents[type][key].selected = isSolicitudFileSelected;
    if (isSolicitudFileSelected) {
      // Eliminar archivos del dropzone, porque solo se puede tener uno al mismo tiempo
      this.onRemove(type, key);
    }
  }

  public isUploadSelected(type: any, key: string): boolean {
    const documents = this.getSolicitudDocumentListByType(type) as any;
    if (documents) {
      return documents[key]?.selected ?? false;
    }
    return false;
  }

  /**
   * Handle previous step event and emit the step data
   */
  public onPreviousStepClick(): void {
    this.changeContent.emit({
      isNext: false,
      step_action: -1,
      data: {
        name: "",
        value: "",
      },
    });
  }

  /**
   * Handle next step event and emit the step data
   */
  public nextStep(): void {
    const fileObject = this.getFilesArray();
    let objectFiles = fileObject.valueOf();

    this.actualSumWeight = 0;
    this.largeFiles = [];

    for (let m in objectFiles.files) {
      let actualFile = objectFiles.files[m];
      let actualSize = actualFile.value.size;
      let actualName = actualFile.name;
      this.actualSumWeight = this.actualSumWeight + actualSize;

      let formatedValue = this.bytesToSize(actualSize);
      let arrValues = formatedValue.split(" ");

      if (parseFloat(arrValues[0]) >= 2.0 && arrValues[1] == "MB") {
        this.largeFiles.push(
          this.getActualNameSection(actualName, objectFiles.data)
        );
      }
    }

    if (typeof fileObject !== "boolean") {
      if (this.filesIsComplete(fileObject.data)) {
        if (this.actualSumWeight > this.limitWeight) {
          if (this.largeFiles.length == 1) {
            this.toastr.warning("Por favor de revisar los siguientes archivos");
            this.onClose();
          } else {
            this.toastr.warning("Por favor de revisar los siguientes archivos");
            this.onClose();
            return;
          }
        } else {
          this.changeContent.emit({
            isNext: true,
            step_action: 1,
            data: {
              name: "datosDocumentos",
              value: fileObject,
            },
          });
          return;
        }
      } else {
        this.toastr.warning("Todos los documentos son requeridos.");
        return;
      }
    } else {
      this.toastr.warning("La fecha de vencimiento es requerida.");
    }
  }

  public getActualNameSection(name: String, objectSearch: any) {
    let temp: any = {};

    for (let m in objectSearch["estandar"]) {
      if (objectSearch["estandar"][m]["llave"] == name) {
        temp.name = objectSearch["estandar"][m]["nombre"];
      }
    }

    for (let m in objectSearch["especifico"]) {
      if (objectSearch["especifico"][m]["llave"] == name) {
        temp.name = objectSearch["especifico"][m]["nombre"];
      }
    }

    return temp;
  }

  bytesToSize(bytes: number) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));

    if (bytes == 0) {
      return "n/a";
    } else {
      if (i == 0) {
        return bytes + " " + sizes[i];
      } else {
        return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
      }
    }
  }

  onClose() {
    this.showFileMOdal = !this.showFileMOdal;
  }

  /**
   * Dropzone on file select event handler
   * @param {any} e Dropzone event, has te added files
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @param {string} name file name
   */
  public onSelect(e: any, type: string = "estandar", name = "CURP"): void {
    const newItem = {
      fechaVigencia: "",
      file: e.addedFiles[0],
    };
    this.files[type][name] = newItem;
  }

  /**
   * Dropzone on remove file event handler
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @param {string} name file name
   */
  public onRemove(type: string = "estandar", name: string = "CURP"): void {
    delete this.files[type][name];
  }

  /********************************
   ********** AUXILIAR *************
   *********************************/

  private async getDocumentUrl() {
    for (const key in this.documents.estandar) {
      const documentName = this.documents.estandar[key].fileList[0].urlPath;
      this.documents.estandar[key].signedUrl =
        await this.applicationService.getFile(documentName);
      this.documents.estandar[key].selected = false;
    }

    for (const key in this.documents.especifico) {
      const documentName = this.documents.especifico[key].fileList[0].urlPath;
      (this.documents.especifico[key].signedUrl =
        await this.applicationService.getFile(documentName)),
        (this.documents.especifico[key].selected = false);
    }
  }

  private getUploadFiles():
    | { data: any; files: Array<{ name: string; value: File }> }
    | boolean {
    const result: { data: any; files: Array<{ name: string; value: File }> } = {
      data: {
        estandar: [],
        especifico: [],
      },
      files: [],
    };

    for (const type in this.files) {
      for (const file in this.files[type]) {
        const fileKey = `${type}_${file.replace(/\s/g, "")}`; // Quitar espacios en el nombre del documento
        if (this.files[type][file].fechaVigencia === "") {
          // Si la fecha de vigencia no esta seleccionada no se hace el arreglo
          return false;
        }
        result.data[type].push({
          llave: fileKey,
          nombre: file,
          uid: "",
          fechaVigencia: this.files[type][file].fechaVigencia.toString(),
        });
        result.files.push({
          name: fileKey,
          value: this.files[type][file].file,
        });
      }
    }

    if (
      !this.isUpdate &&
      !this.editFolio.length &&
      this.vigenciaAnio < 2023
    ) {
      return this.createAcuseFile(result);
    }

    if (
      !this.isUpdate &&
      !this.editFolio.length &&
      this.vigenciaAnio >= 2023
    ) {
      return this.createSolicitudFile(result);
    }

    return result;
  }

  public createFile(isAcuse: boolean = true): File {
    const name = isAcuse ? "Acuse en blanco" : " Solicitud en blanco";
    const filename = isAcuse ? "estandar_Acuse.pdf" : "estandar_Solicitud.pdf";
    const parts = [
      new Blob([name], { type: "application/pdf" }),
      name,
      new Uint16Array([33]),
    ];
    const file = new File(parts, "estandar_Acuse.pdf", {
      type: "application/pdf",
    });
    return file;
  }

  public createSolicitudFile(result: any): any {
    result["data"]["estandar"].push({
      llave: "estandar_Solicitud",
      nombre: "Solicitud",
      uid: "",
      fechaVigencia: new Date("12-12-2023"),
    });

    result["files"].push({
      name: "estandar_Solicitud",
      value: this.createFile(false),
    });

    return result;
  }

  public createAcuseFile(result: any): any {
    result["data"]["estandar"].push({
      llave: "estandar_Acuse",
      nombre: "Formato de Firma y Acuse",
      uid: "",
      fechaVigencia:
        "Sat Jun 01 2022 13:00:00 GMT-0500 (Central Daylight Time)",
    });

    result["files"].push({
      name: "estandar_Acuse",
      value: this.createFile(),
    });

    return result;
  }

  private filesIsComplete(filesData: any): boolean {
    const uploadLength =
      filesData.estandar.length + filesData.especifico.length;
    let documentsLength = this.isUpdate
      ? Object.keys(this.solicitudStandardDocuments).length +
        Object.keys(this.solicitudProgramDocuments).length
      : this.standardDocuments.length + this.programDocuments.length;

    const existAcuse = Object.keys(filesData["estandar"]).some(
      (key: any) => filesData["estandar"][key]["llave"] === "estandar_Acuse"
    );
    const existSolicitud = Object.keys(filesData["estandar"]).some(
      (key: any) => filesData["estandar"][key]["llave"] === "estandar_Solicitud"
    );

    documentsLength =
      documentsLength + (existAcuse ? 1 : 0) + (existSolicitud ? 1 : 0);

    if (uploadLength <= documentsLength) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Format the files array to send in the emitter
   * @param {string} type estandar | complementary, depends of the ng-dropzone
   * @returns Files array
   *
   * @comments Change | boolean type to any to work with the new funtion to know the weight of the files
   */
  private getFilesArray():
    | { data: any; files: Array<{ name: string; value: File }> }
    | any {
    let result = this.getUploadFiles(); // Append uploaded files

    if (typeof result !== "boolean") {
      result = this.getS3Files(result); // Append s3 selected files
    }

    return result;
  }

  private getS3Files(result: {
    data: any;
    files: Array<{ name: string; value: File }>;
  }): { data: any; files: Array<{ name: string; value: File }> } {
    for (const key in this.documents) {
      for (const name in this.documents[key]) {
        if (this.documents[key][name].selected) {
          result.data[key].push(
            SolicitudFunctions.getCleanDocument(this.documents[key][name])
          );
        }
      }
    }
    return result;
  }
}
