import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import {
  ApplicationStorageEntity,
  TokenEntity,
  SessionEntity,
} from "@app/data/entities";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { SolicitudFunctions, ResponseFunctions } from "@app/data/functions";

@Injectable({
  providedIn: "root",
})
export class ApplicationService {
  private token: TokenEntity;
  private session: SessionEntity;
  private entity: string = "application";
  private applicationStorage: ApplicationStorageEntity =
    new ApplicationStorageEntity();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
  }

  /********************************
   * ********* GET *************
   * ******************************
   */

  public get(
    curp: string,
    needCedula: boolean | null,
    needSolicitante: boolean | null,
    getData: (data: any) => void
  ): void {
    this.http
      .get(`${environment.SOLICITUD_API}/v1/${this.entity}/${curp}`)
      .subscribe(
        (response: any) => {
          if (response.success) {
            if ((needCedula || needCedula == null) && response.result.cedula) {
              this.applicationStorage.cedula = {
                solicitudImpulso: true,
                cedulaImpulso: true,
                ...response.result.cedula,
              };
            }
            this.applicationStorage.documents = response.result.documentos;
            getData({
              ...response.result.solicitud,
              ...(needSolicitante
                ? { datosCurp: response.result.solicitante }
                : {}),
            });
          } else {
            getData({});
          }
        },
        (error) => {
          getData({});
        }
      );
  }

  public getSolicitud(
    solicitud: string,

    getData: (data: any) => void
  ): void {
    this.http
      .get(`${environment.SOLICITUD_API}/v1/${this.entity}/${solicitud}`)
      .subscribe(
        (response: any) => {
          if (response.success) {
            getData(response.result);
          } else {
            getData({});
          }
        },
        (error) => {
          getData({});
        }
      );
  }

  public getFormatted(
    curp: string,
    needCedula: boolean | null,
    isForUpdate: boolean | null,
    getData: (data: any) => void
  ): void {
    this.http
      .get(`${environment.SOLICITUD_API}/v1/${this.entity}/byUpdate/${curp}`)
      .subscribe(
        (response: any) => {
          const data = response.result;
          if (response.success) {
            if ((needCedula || needCedula == null) && data.cedula) {
              this.applicationStorage.originalAndCopyCedula = {
                solicitudImpulso: true,
                cedulaImpulso: true,
                ...data.cedula,
              };
            }
            this.applicationStorage.originalAndCopyDocumentos = data.documentos;
            getData(data.solicitud);
          } else {
            getData({});
          }
        },
        (error) => {
          getData({});
        }
      );
  }

  public async getFile(filePath: string): Promise<string> {
    try {
      const response: any = await this.http
        .get(
          `${environment.SOLICITUD_API}/v1/application/getFiles?key=${filePath}`
        )
        .toPromise();
      if (response.success) {
        return response.result.signedRequest;
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }
  }

  public listSolicitud(
    pagination: any,
    status: string | null,
    selectedApoyo: string | null,
    word: string | null,
    municipio: string | null,
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    const handleListResponse = ResponseFunctions.handlePaginatedListResponse(
      this.toastr,
      getList
    );

    const body = {
      status,
      selectedApoyo,
      word,
      municipio,
      vigencia,
    };
    this.http
      .put(
        `${environment.SOLICITUD_API}/v1/${this.entity}/list/solicitud?size=${pagination.pageSize}&index=${pagination.pageIndex}`,
        body
      )
      .pipe(first())
      .subscribe({
        next: handleListResponse.success,
        error: handleListResponse.error,
      });
  }

  public downloadSolicitudesMultiple(
    status: string | null,
    selectedApoyo: string | null,
    word: string | null,
    municipio: string | null,
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    const body = {
      status,
      selectedApoyo,
      word,
      municipio,
      vigencia,
    };

    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/${this.entity}/download/solicitudes`,
        body
      )
      .pipe(first())
      .subscribe((response: any) => {
        var buf = response.data;
        const blob = new Blob([buf], { type: "application/pdf" });
        //const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
  }

  /********************************
   * ********* CREATE *************
   * ******************************
   */
  public createCedula(
    documents: any,
    documentsData: any,
    is_special_peu: boolean,
    getData: (data: { folio: string }) => void
  ): void {
    const handleResponse = this.handleCreateResponse(getData);

    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/application/cedula/register`,
        this.appendCreateData(true, documents, documentsData, is_special_peu)
      )
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public createSolicitud(
    documents: any,
    documentsData: any,
    is_special_peu: boolean,
    getData: (data: { folio: string }) => void
  ): void {
    const handleResponse = this.handleCreateResponse(getData);

    const year = this.session.viewingYear;
    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/application/solicitud/${
          year >= 2023 ? "2023/" : ""
        }register`,
        this.appendCreateData(false, documents, documentsData, is_special_peu)
      )
      .subscribe(handleResponse.success, handleResponse.error);
  }

  private appendCreateData(
    isCedula: boolean = false,
    documents: any,
    documentsData: any,
    is_special_peu: boolean = false
  ): FormData {
    const applicationForm: FormData = new FormData();
    const program = this.applicationStorage.program;
    const cleanProgram = SolicitudFunctions.getCleanProgram(program);
    applicationForm.append("programa", JSON.stringify(cleanProgram));

    if (isCedula) {
      const cedula = this.applicationStorage.cedula;
      const cleanCedula = SolicitudFunctions.getCleanCedula(cedula);
      applicationForm.append("cedula", JSON.stringify(cleanCedula));
    }

    const solicitud = this.applicationStorage.solicitud;
    applicationForm.append("solicitud", JSON.stringify(solicitud));

    // validate if is peu_especial (doesnt have documents)
    if (is_special_peu === true) {
      applicationForm.append(
        "documentos",
        JSON.stringify({
          estandar: [],
          especifico: [],
        })
      );
      return applicationForm;
    } else {
      applicationForm.append(
        "documentos",
        JSON.stringify(documentsData.datosDocumentos)
      );
      for (const file of documents) {
        applicationForm.append(file.name, file.value);
      }
      return applicationForm;
    }
  }

  public editCedula(
    documents: any,
    documentsData: any,
    getData: (data: { folio: string }) => void
  ): void {
    const handleResponse = this.handleCreateResponse(getData, true);
    this.appendEditData(documents, documentsData);
    this.http
      .put(
        `${environment.SOLICITUD_API}/v1/application/cedula/update`,
        this.appendEditData(documents, documentsData)
      )
      .subscribe(handleResponse.success, handleResponse.error);
  }

  private appendEditData(documents: any, documentsData: any): FormData {
    const applicationForm: FormData = new FormData();

    const program = this.applicationStorage.program;
    const cleanProgram = SolicitudFunctions.getCleanProgram(program);
    applicationForm.append("programa", JSON.stringify(cleanProgram));

    const folio = this.applicationStorage.editFolio;
    applicationForm.append("folio", folio);

    const cedula = this.applicationStorage.cedulaDifferences;
    applicationForm.append("cedula", JSON.stringify(cedula));

    const solicitud = this.applicationStorage.solicitudDifferences;
    applicationForm.append("solicitud", JSON.stringify(solicitud));

    applicationForm.append(
      "documentos",
      JSON.stringify(documentsData.datosDocumentos)
    );
    for (const file of documents) {
      applicationForm.append(file.name, file.value);
    }
    return applicationForm;
  }

  private handleCreateResponse(
    getData: (data: { folio: string }) => void,
    isEdit: boolean = false
  ): {
    success: ((value: Object) => void) | undefined;
    error: ((error: any) => void) | undefined;
  } {
    return {
      success: (response: any) => {
        if (response.success) {
          const acuse = response.result.acuse;
          if (typeof acuse === "string" && !acuse.includes("Error")) {
            this.showAcuse(response.result.acuse);
          }
          this.applicationStorage.clearAll();
          this.toastr.success("La solicitud se ha registrado correctamente.");
          if (!isEdit) {
            this.toastr.info(
              "Favor de subir su acuse, de otra forma, su solicitud será rechazada automáticamente"
            );
          }
          return getData({
            folio: response.result.folio ?? "true",
          });
        }
        this.toastr.error(
          "Hubo un problema al procesar su solicitud.",
          "Solicitud"
        );
        return getData({
          folio: "",
        });
      },
      error: (error: any) => {
        this.toastr.error(
          "Hubo un problema al procesar su solicitud.",
          "Solicitud"
        );
        return getData({
          folio: "",
        });
      },
    };
  }

  /********************************
   * ********* ACUSE *************
   * ******************************
   */

  public getAcuse(folio: string, isSuccess: (isSuccess: boolean) => void) {
    this.http
      .get(`${environment.SOLICITUD_API}/v1/application/acuse/${folio}`)
      .subscribe(
        (response: any) => {
          if (response.success && typeof response.result.acuse === "string") {
            this.toastr.info(
              "Favor de subir su acuse, de otra forma, su solicitud será rechazada automáticamente"
            );
            this.showAcuse(response.result.acuse);
            isSuccess(true);
            return;
          }
          this.toastr.error(
            "Ocurrió un error al generar el acuse, por favor inténtelo de nuevo más tarde.",
            "Acuse"
          );
          isSuccess(false);
        },
        (error) => {
          this.toastr.error(
            "Ocurrió un error al generar el acuse, por favor inténtelo de nuevo más tarde.",
            "Acuse"
          );
          isSuccess(false);
        }
      );
  }

  public uploadAcuse(
    folio: string,
    documentsData: any,
    file: any,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const applicationForm: FormData = new FormData();
    applicationForm.append("folio", folio);

    applicationForm.append("documentos", JSON.stringify(documentsData));

    applicationForm.append(file.name, file.value);

    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/application/updateFiles`,
        applicationForm
      )
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.toastr.success("El acuse se ha subido correctamente");
            isSuccess(response.success);
            return;
          }
          isSuccess(response.success);
          this.toastr.error(
            "Ocurrió un error al generar el acuse, por favor inténtelo de nuevo más tarde.",
            "Acuse"
          );
        },
        (error) => {
          isSuccess(false);
          this.toastr.error(
            "Ocurrió un error al generar el acuse, por favor inténtelo de nuevo más tarde.",
            "Acuse"
          );
        }
      );
  }

  private showAcuse(acuse: string): void {
    const byteCharacters = atob(acuse);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }

  // public listSolicitudByPanel(
  //   isByUser: boolean | null,
  //   pagination: any,
  //   panel: string,
  //   getList: (data: { list: Array<any>; total: number }) => void
  // ): void {
  //   const handleListResponse = ResponseFunctions.handlePaginatedListResponse(
  //     this.toastr,
  //     getList
  //   );
  //   this.http
  //     .get(
  //       `${environment.SOLICITUD_API}/v1/${this.entity
  //       }/list/solicitud/${panel}?${typeof isByUser === 'boolean' ? 'byUser=' + isByUser + '&' : ''
  //       }size=${pagination.pageSize}&index=${pagination.pageIndex}`
  //     )
  //     .pipe(first())
  //     .subscribe(handleListResponse.success, handleListResponse.error);
  // }

  // public listSolicitudByPanelAndWord(
  //   isByUser: boolean | null,
  //   pagination: any,
  //   panel: string,
  //   word: string,
  //   getList: (data: { list: Array<any>; total: number }) => void
  // ): void {
  //   const handleListResponse = ResponseFunctions.handlePaginatedListResponse(
  //     this.toastr,
  //     getList
  //   );
  //   // this.http
  //   //   .get(
  //   //     `${environment.SOLICITUD_API}/v1/${this.entity
  //   //     }/list/solicitud/filtered/${panel}/${word}?${typeof isByUser === 'boolean' ? 'byUser=' + isByUser + '&' : ''
  //   //     }size=${pagination.pageSize}&index=${pagination.pageIndex}`
  //   //   )
  //   //   .pipe(first())
  //   //   .subscribe(handleListResponse.success, handleListResponse.error);
  // }

  /********************************
   * ******** Prefolio **********
   * ******************************
   */
  public validatePreFolio(
    folio: string,
    isSuccess: (response: { isSuccess: boolean; curp: string }) => void
  ): void {
    this.http
      .get(`${environment.SOLICITUD_API}/v1/${this.entity}/validate/${folio}`)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            let prefolioData = response.result;
            if (this.verifyPreFolioByToken(prefolioData)) {
              return isSuccess({ isSuccess: true, curp: response.result.curp });
            } else {
              const program = this.applicationStorage.program;
              if (!(program.modalidad.clave === prefolioData.modalidad.clave)) {
                this.toastr.warning(
                  "El folio ingresado no corresponde a la modalidad seleccionada"
                );
              } else {
                this.toastr.warning(
                  "El folio ingresado no está asignado a sus modalidades."
                );
              }
              return isSuccess({ isSuccess: false, curp: "" });
            }
          } else {
            this.toastr.warning(
              response.message.replace("Failed:", "") ??
                "El folio ingresado no existe."
            );
            return isSuccess({ isSuccess: false, curp: "" });
          }
        },
        (error) => {
          this.toastr.error(
            "Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde."
          );
          isSuccess({ isSuccess: false, curp: "" });
        }
      );
  }

  /********************************
   ********** DOCUMENTS *************
   *******************************
   */

  public updateDocuments(
    folio: string,
    documentsData: any,
    files: any,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const applicationForm: FormData = new FormData();
    applicationForm.append("folio", folio);
    applicationForm.append("documentos", JSON.stringify(documentsData));
    for (const file of files) {
      applicationForm.append(file.name, file.value);
    }

    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/application/updateFiles`,
        applicationForm
      )
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.toastr.success(
              "Los documentos se han actualizado correctamente",
              "Actualizar Documentos"
            );
            isSuccess(response.success);
            return;
          }
          isSuccess(response.success);
          this.toastr.error(
            "Ocurrió un error al actualizar los documentos, por favor inténtelo de nuevo más tarde.",
            "Actualizar Documentos"
          );
        },
        (error) => {
          isSuccess(false);
          this.toastr.error(
            "Ocurrió un error al tramitar su solicitud, por favor inténtelo de nuevo más tarde.",
            "Actualizar Documentos"
          );
        }
      );
  }

  /********************************
   * ********* MISC ***************
   * ******************************
   */

  public getApplicationCount(
    curp: string,
    apoyo: string,
    getCount: (count: number) => void
  ) {
    this.http.put(
      `${environment.SOLICITUD_API}/v1/${this.entity}/countByCitizen`,
      { curp, apoyo }
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          return getCount(response.result);
        }
        this.toastr.error(
          "Ocurrió un error al tratar de obtener el contador, por favor, inténtelo más tarde.",
          "Solicitud"
        );
        return getCount(-1);
      },
      error: (error: any) => {
        this.toastr.error(
          "Hubo un problema al procesar su solicitud.",
          "Solicitud"
        );
        return getCount(-1);
      }
    })
  }

  private verifyPreFolioByToken(prefolioData: any): any {
    const program = this.applicationStorage.program;
    if (
      "modalidad" in prefolioData &&
      !(program.modalidad.clave === prefolioData.modalidad?.clave)
    )
      return false;
    this.session = new SessionEntity();
    if (this.session.getActiveRole.apoyos) {
      let apoyos = this.session.getActiveRole.apoyos.map((apoyo: any) => {
        return apoyo.clave.substring(0, apoyo.clave.length - 3);
      });
      return apoyos.includes(prefolioData.modalidad.clave);
    }
    return (
      !this.session.getActiveRole.dependencia ||
      this.session.getActiveRole.dependencia?.acronym ===
        prefolioData.dependencia.siglas
    );
  }
}
