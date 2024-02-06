import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import {
  ResponseFunctions,
  SolicitudPanelFunctions,
} from "@app/data/functions";
import * as moment from "moment";
import { TokenEntity } from "@app/data/entities";
import { MiniKpiClassType, SortedStepsType } from "@data/types";
import { saveAs } from "file-saver";
import axios from 'axios';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class TrackingFlowService {
  private token: TokenEntity;
  private tracking: string = "trackingFlow";
  private trackingApplication: string = "application";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService
    ) {
    this.token = new TokenEntity(this.cookieService);
  }

  public getKpiCountList(
    selectedApoyo: string,
    getData: (data: any) => void
  ): any {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.tracking}/list/kpi-count/${selectedApoyo}`
      )
      .subscribe(
        (response: any) => {
          if (response.success) {
            return getData(this.formatKpiCount(response.result));
          } else {
            this.toastr.error(
              "Ocurrió un error al tramitar su solicitud, por favor inténtelo de nuevo más tarde."
            );
            return getData(this.emptyKpiCount());
          }
        },
        (error: any) => {
          this.toastr.error(
            "Ocurrió un error al tramitar su solicitud, por favor inténtelo de nuevo más tarde."
          );
          return getData(this.emptyKpiCount());
        }
      );
  }
  public getApplicantionList(
    rol_value: string,
    q_param: any,
    modalities: any
  ): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/list/all/${rol_value}/${q_param}/${modalities}`
    );
  }

  public getMiniKpiPendingList(
    rol_value: string,
    q_param: any,
    modalities: any
  ): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/list/miniKpiPending/${rol_value}/${q_param}/${modalities}`
    );
  }
  public getApplicationListByStatus(
    status_selected: string,
    rol_value: string,
    q: string,
    pagination: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.tracking}/list/status/${pagination.pageSize}/${pagination.pageIndex}/${rol_value}/${q}/${status_selected}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getList({
              list: response.result.list,
              total: response.result.total,
            });
          } else {
            getList({
              list: [],
              total: 0,
            });
            this.toastr.error("Hubo un problema al paginar las solicitudes.");
          }
        },
        (error: any) => {
          getList({
            list: [],
            total: 0,
          });
          this.toastr.error(
            "Hubo un problema al paginar las solicitudes.",
            "Solicitud"
          );
        }
      );
  }

  public listSolicitudByStatus(
    pagination: any,
    status: string,
    selectedQ: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    const handleListResponse = ResponseFunctions.handlePaginatedListResponse(
      this.toastr,
      getList
    );
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/list/solicitud/status/${status}/${selectedQ}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }
  public listSolicitudByWordAndStatus(
    pagination: any,
    status: string,
    selectedQ: string,
    word: string,
    municipio: string | null,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    const handleListResponse = ResponseFunctions.handlePaginatedListResponse(
      this.toastr,
      getList
    );
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.tracking
        }/list/solicitud/status/filtered/${status}/${selectedQ}/${municipio ?? "-"
        }/${word && word.length ? word : "-"}?size=${pagination.pageSize
        }&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }
  /*********************
   * PENDING -- STATUS *
   *********************/
  public getRequirements(clave: string): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/getRequirements/${clave}`
    );
  }
  /***********************
   * VALIDATION -- STATUS *
   ************************/
  public validateApplication(folio: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/validate`,
      { folio }
    );
  }
  /**************************
   * DICTAMINATION -- STATUS *
   ***************************/
  public dictamineApplication(
    folio: any,
    file_object: any,
    body_to_status: any,
    type: string,
    responseCallback: (data: any) => void
  ): void {
    if (type == "appendDocument") {
      //1 Change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/dictamine`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            //2 Append files
            this.http
              .post(
                `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/addEvidence`,
                this.createFormDataOneDocument(
                  folio,
                  file_object,
                  "dictaminacion"
                )
              )
              .subscribe(
                (success) => {
                  responseCallback({ success: true });
                },
                (error) => {
                  this.toastr.error("Error al dictaminar la solicitud");
                  responseCallback({ success: false });
                }
              );
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    } else {
      // change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/dictamine`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            responseCallback({ success: true });
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    }
  }
  /*******************
   * APROVE -- STATUS *
   ********************/
  public approveApplication(
    folio: any,
    file_object: any,
    body_to_status: any,
    type: string,
    responseCallback: (data: any) => void
  ): void {
    if (type == "appendDocument") {
      //1 Change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/approve`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            //2 Append files
            this.http
              .post(
                `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/addEvidence`,
                this.createFormDataOneDocument(folio, file_object, "entregada")
              )
              .subscribe(
                (success) => {
                  responseCallback({ success: true });
                },
                (error) => {
                  this.toastr.error("Error al aprobar la solicitud");
                  responseCallback({ success: false });
                }
              );
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    } else {
      // change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/approve`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            responseCallback({ success: true });
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    }
  }
  /**********************
   * DELIVERED -- STATUS *
   ***********************/
  public deliverApplication(
    folio: any,
    file_object: any,
    body_to_status: any,
    type: string,
    responseCallback: (data: any) => void
  ): void {
    if (type == "appendDocument") {
      //1 Change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/deliver`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            //2 Append files
            this.http
              .post(
                `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/addEvidence`,
                this.createFormDataOneDocument(folio, file_object, "entregada")
              )
              .subscribe(
                (success) => {
                  responseCallback({ success: true });
                },
                (error) => {
                  this.toastr.error("Error al entregar la solicitud");
                  responseCallback({ success: false });
                }
              );
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    } else {
      // change status
      this.http
        .post(`${environment.SOLICITUD_API}/v1/${this.tracking}/deliver`, {
          body_to_status,
        })
        .subscribe(
          (success_dictaminar) => {
            responseCallback({ success: true });
          },
          (error_dictaminar) => {
            responseCallback({ success: false });
          }
        );
    }
  }
  /*********************
   * REJECTED -- STATUS *
   **********************/
  public rejectApplication(obj_reject: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/reject`,
      { obj_reject }
    );
  }
  public getRejectList(): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/list/reject`
    );
  }
  /*********************
   * CANCELED -- STATUS *
   **********************/
  public cancelApplication(obj_cancel: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/cancel`,
      { obj_cancel }
    );
  }
  public getCancelListOptions(): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/list/getCancelListOptions`
    );
  }
  /*********************
   * OBSERVATION -- STATUS *
   **********************/
  public sendRequestForObservation(new_comments: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/addComments`,
      new_comments
    );
  }
  /**************************************
   * ACTIONS -- ON -- MULTIPLE -- FOLIOS *
   ***************************************/
  public rejectApplicationMUltipleFolios(obj_reject: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/rejectMultipleFolios`,
      { obj_reject }
    );
  }
  public updateStatusOnManyFolios(obj_reject: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/updateStatusOnManyFolios`,
      { obj_reject }
    );
  }
  public ListStatusLogByFolio(folio_selected: string): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/list/statusLog/${folio_selected}`
    );
  }
  /************
   * U T I L S *
   *************/
  private createFormDataOneDocument(
    folio: any,
    file_object: any,
    status: string
  ): FormData {
    const applicationForm: FormData = new FormData();
    let evidence_name = folio + "_evidencia_" + status;
    applicationForm.append("folio", folio);
    let document_object = {
      evidencia: [
        {
          llave: evidence_name,
          nombre: evidence_name,
          uid: "",
          fechaVigencia: moment().add(10, "years"),
        },
      ],
    };
    applicationForm.append("documentos", JSON.stringify(document_object));
    applicationForm.append(evidence_name, file_object);
    return applicationForm;
  }
  public getStatusList(): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/list/status`
    );
  }
  public listHistoricalApplications(
    curp_selected: string,
    page: { pageSize: number; pageIndex: number },
    responseCallback: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/list/historical/${curp_selected}/${page.pageSize}/${page.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback({
              list: response.result.list,
              total: response.result.total,
            });
          } else {
            responseCallback({
              list: [],
              total: 0,
            });
            this.toastr.error(
              "Hubo un problema al obtener el historico del usuario."
            );
          }
        },
        (error) => {
          responseCallback({
            list: [],
            total: 0,
          });
          this.toastr.error(
            "Hubo un problema al obtener el historico del usuario."
          );
        }
      );
  }
  public getCountKpiHistorial(
    curp_selected: string,
    returnCallback: (rejected_total: number, entered_total: number) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/list/historicalKpi/${curp_selected}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            let rejected_total = response.result[0];
            let entered_total = response.result[1];
            returnCallback(rejected_total, entered_total);
          } else {
            returnCallback(0, 0);
            this.toastr.error("Hubo un problema al contar la info.");
          }
        },
        (error: any) => {
          returnCallback(0, 0);
          this.toastr.error(
            "Hubo un problema al procesar su solicitud",
            "Solicitud"
          );
        }
      );
  }
  public downloadFile(url_path: string): any {
    return this.http.get(
      `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/getFiles?key=${url_path}`
    );
  }
  public downloadFolioZip(finalList: any, folio: string): any {
    // let uri = "http://localhost:3690/zip/generateZip";
    let uri = `${environment.ZIP_API}/zipgenerator/zip/generateZip`;   

    axios.post(uri, { urls: finalList, folio: folio }, { responseType: "blob" }).then((response: any) => {

      const responseData = response.data
      var blob = new Blob([responseData], { type: 'application/octet-stream' });

      this.spinner.hide();
      saveAs(blob, folio + '.zip', true);
    })
      .catch((error: any) => {
        console.log(error);
      });

    return;
  }
  
  public generateZipByFolio(folio: string): any {
    let uri = `${environment.ZIP_API}/zipgenerator/zip/generateZipByFolio?folio=${folio}`;   

    axios.get(uri, { responseType: "blob" }).then((response: any) => {

      const responseData = response.data
      var blob = new Blob([responseData], { type: 'application/octet-stream' });

      this.spinner.hide();
      saveAs(blob, folio + '.zip', true);
    })
      .catch((error: any) => {
        console.log(error);
      });

    return;
  }

  public downloadZipByQ(selectedQ: string): any {
    // return this.http.post(`${environment.SOLICITUD_API}/v1/${this.tracking}/downloadZipByQ`, { selectedQ: selectedQ });
  }
  // This function formats the response of the server
  // this validates all the status invlved on the flow that has for all steps
  public formatKpiCount(data: any): any {
    const enteredIndex = data.findIndex(
      (value: any) => value._id === "Entregada"
    );
    const pendingIndex = data.findIndex(
      (value: any) => value._id === "Pendiente"
    );
    const rejectedIndex = data.findIndex(
      (value: any) => value._id === "Rechazada"
    );
    const validateIndex = data.findIndex(
      (value: any) => value._id === "Validada"
    );
    const dictaminationIndex = data.findIndex(
      (value: any) => value._id === "Dictaminacion"
    );
    const aprovedIndex = data.findIndex(
      (value: any) => value._id === "Aprobada"
    );
    const observationIndex = data.findIndex(
      (value: any) => value._id === "En observación"
    );
    const cancelationIndex = data.findIndex(
      (value: any) => value._id === "Cancelada"
    );

    return {
      entered: {
        count: enteredIndex !== -1 ? data[enteredIndex].count : 0,
        title:
          enteredIndex !== -1
            ? "Solicitudes " + data[enteredIndex]._id + "s"
            : "Solicitudes Entregadas",
        class: "success",
        type: enteredIndex !== -1 ? data[enteredIndex]._id : "Ingresada",
        isActive: false,
        color: "#9BD093",
      },
      pending: {
        count: pendingIndex !== -1 ? data[pendingIndex].count : 0,
        title:
          pendingIndex !== -1
            ? "Solicitudes " + data[pendingIndex]._id + "s"
            : "Solicitudes Pendientes",
        class: "warning",
        type: pendingIndex !== -1 ? data[pendingIndex]._id : "Pendiente",
        isActive: false,
        color: "#FFB63E",
      },
      rejected: {
        count: rejectedIndex !== -1 ? data[rejectedIndex].count : 0,
        title:
          rejectedIndex !== -1
            ? "Solicitudes " + data[rejectedIndex]._id + "s"
            : "Solicitudes Rechazadas",
        class: "danger",
        type: rejectedIndex !== -1 ? data[rejectedIndex]._id : "Rechazada",
        isActive: false,
        color: "#F25230",
      },
      validated: {
        count: validateIndex !== -1 ? data[validateIndex].count : 0,
        title:
          validateIndex !== -1
            ? "Solicitudes " + data[validateIndex]._id + "s"
            : "Solicitudes Validadas",
        class: "validate-status",
        type: validateIndex !== -1 ? data[validateIndex]._id : "Validada",
        isActive: false,
        color: "#037171",
      },
      dictamination: {
        count: dictaminationIndex !== -1 ? data[dictaminationIndex].count : 0,
        title:
          dictaminationIndex !== -1
            ? "Solicitudes " + data[dictaminationIndex]._id
            : "Solicitudes En Dictaminacion",
        class: "dictamination-status",
        type:
          dictaminationIndex !== -1
            ? data[dictaminationIndex]._id
            : "Dictaminacion",
        isActive: false,
        color: "#DBA159",
      },
      aproved: {
        count: aprovedIndex !== -1 ? data[aprovedIndex].count : 0,
        title:
          aprovedIndex !== -1
            ? "Solicitudes " + data[aprovedIndex]._id + "s"
            : "Solicitudes Aprobadas",
        class: "aproved-status",
        type: aprovedIndex !== -1 ? data[aprovedIndex]._id : "Aprobada",
        isActive: false,
        color: "#03312E",
      },
      observation: {
        count: observationIndex !== -1 ? data[observationIndex].count : 0,
        title: "Solicitudes en observación",
        class: "observed-status",
        type:
          observationIndex !== -1
            ? data[observationIndex]._id
            : "En observación",
        isActive: false,
        color: "#15BED9",
      },
      canceled: {
        count: cancelationIndex !== -1 ? data[cancelationIndex].count : 0,
        title: "Solicitudes canceladas",
        class: "canceled-status",
        type:
          cancelationIndex !== -1 ? data[cancelationIndex]._id : "Cancelada",
        isActive: true,
        color: "#FFB63E",
      },
    };
  }
  private emptyKpiCount(): any {
    return {
      entered: {
        count: 0,
        title: "Solicitudes Entregadas",
        class: "success",
        type: "Ingresada",
        isActive: false,
      },
      pending: {
        count: 0,
        title: "Solicitudes Pendientes",
        class: "warning",
        type: "Pendiente",
        isActive: false,
      },
      rejected: {
        count: 0,
        title: "Solicitudes Rechazadas",
        class: "danger",
        type: "Rechazada",
        isActive: false,
      },
    };
  }
  public getMiniKpiKeyOrValue(
    description: string,
    configFlow: string = "key"
  ): string {
    let valueSelected: string = "";
    let config: any = {
      pending: "Pendiente",
      validated: "Validada",
      dictamination: "Dictaminacion",
      aproved: "Aprobada",
      entered: "Entregada",
      rejected: "Rechazada",
      observation: "En observación",
      canceled: "Cancelada",
    };

    if (configFlow == "key") {
      for (let key in config) {
        if (config[key] == description) {
          valueSelected = key.toString();
        }
      }
    } else {
      valueSelected = config[description];
    }
    return valueSelected;
  }
  public configViewMiniKpi(
    supportType: [string, any] | string,
    status: string,
    activeRol: any
  ): [Map<string, MiniKpiClassType>, Array<any>] {
    // Minikpi list data
    let miniKpiMap = new Map();
    //Array control [1=Pendiente,99=Rechazada]
    let configCodesForTracking: Array<number> = [1, 99];

    // This is when enter without specific support type
    if (supportType == "-") {
      // Param formated to filter correctly
      let filter = SolicitudPanelFunctions.validateKeyOnSelectedQ(supportType);

      // Get DB count of all requests group by status.
      this.getKpiCountList(filter, (data: any) => {
        // If supportType array exists
        if (activeRol.apoyos) {
          // this walks on this support array
          activeRol.apoyos.forEach((itemRow: any) => {
            // here exists the config of the support type
            itemRow.flujoSeguimiento.forEach((flow: any) => {
              //===> Here inserts the base status if exists on array control
              if (configCodesForTracking.includes(flow.codigo)) {
                // gets the correct key for minikpi config
                let flowKey = this.getMiniKpiKeyOrValue(
                  flow.descripcion,
                  "key"
                );
                // set value
                miniKpiMap.set(flowKey, data[flowKey]);
                // If node 'flujo' exists on actual row then walk thru it and insert into Map values
                if (flow.flujo) {
                  flow.flujo.forEach((lastItem: any) => {
                    let lastItemKey = this.getMiniKpiKeyOrValue(
                      lastItem.descripcion,
                      "key"
                    );
                    // ===> Specific steps
                    miniKpiMap.set(lastItemKey, data[lastItemKey]);
                  });
                }
              }
            });
          });
        }
        this.selectActiveStatus(miniKpiMap, status);
      });

      return [miniKpiMap, []];
    } else {
      let supportTypeSelected = supportType[0];
      let flow = supportType[1];
      let selectedSupportType =
        SolicitudPanelFunctions.validateKeyOnSelectedQ(supportTypeSelected);

      this.getKpiCountList(selectedSupportType, (data: any) => {
        // Reading config to show steps
        flow.forEach((item: any) => {
          let description = item.descripcion;
          let key = this.getMiniKpiKeyOrValue(description, "key");
          // Get all data that has this support type
          // this is for the structure of the tracking flow
          if (item.flujo) {
            // this adds the same row of 'pending' minikpi
            miniKpiMap.set(key, data[key]);
            // this iterates the actual support type flow
            item.flujo.forEach((flowItem: any) => {
              let flowKey = this.getMiniKpiKeyOrValue(
                flowItem.descripcion,
                "key"
              );
              miniKpiMap.set(flowKey, data[flowKey]);
            });
          } else {
            // fill map with data
            miniKpiMap.set(key, data[key]);
          }
        }); //end foreach

        this.selectActiveStatus(miniKpiMap, status);
      }); // end service endpoint

      return [miniKpiMap, []];
    }
  }

  public configViewMiniKpiAll(
    supportType: [string, any] | string,
    status: string,
    activeRol: any
  ): [Map<string, MiniKpiClassType>, Array<any>] {
    // Minikpi list data
    let miniKpiMap = new Map();
    //Array control [1=Pendiente,99=Rechazada]
    let configCodesForTracking: Array<number> = [1, 99];

    // This is when enter without specific support type
    if (supportType == "-") {
      // Param formated to filter correctly
      let filter = SolicitudPanelFunctions.validateKeyOnSelectedQ(supportType);

      // Get DB count of all requests group by status.
      this.getKpiCountList(filter, (data: any) => {
        // If supportType array exists
        if (activeRol.apoyos) {
          // this walks on this support array
          activeRol.apoyos.forEach((itemRow: any) => {
            // here exists the config of the support type
            itemRow.flujoSeguimiento.forEach((flow: any) => {
              //===> Here inserts the base status if exists on array control
              if (configCodesForTracking.includes(flow.codigo)) {
                // gets the correct key for minikpi config
                let flowKey = this.getMiniKpiKeyOrValue(
                  flow.descripcion,
                  "key"
                );
                // set value
                miniKpiMap.set(flowKey, data[flowKey]);
                // If node 'flujo' exists on actual row then walk thru it and insert into Map values
                if (flow.flujo) {
                  flow.flujo.forEach((lastItem: any) => {
                    let lastItemKey = this.getMiniKpiKeyOrValue(
                      lastItem.descripcion,
                      "key"
                    );
                    // ===> Specific steps
                    miniKpiMap.set(lastItemKey, data[lastItemKey]);
                  });
                }
              }
            });
          });
        }
        this.selectActiveStatus(miniKpiMap, status);
      });

      return [miniKpiMap, []];
    } else {
      let supportTypeSelected = supportType[0];
      let flow = supportType[1];
      let selectedSupportType =
        SolicitudPanelFunctions.validateKeyOnSelectedQ(supportTypeSelected);

      this.getKpiCountList(selectedSupportType, (data: any) => {
        for (let item in data) {
          miniKpiMap.set(item, data[item]);
        }

        this.selectActiveStatus(miniKpiMap, status);
      }); // end service endpoint

      return [miniKpiMap, []];
    }
  }

  private selectActiveStatus(miniKpiMap: any, status: string) {
    // fill minikpi with active status on pending
    for (const [key, mapElementData] of miniKpiMap) {
      if (mapElementData && mapElementData != null)
        mapElementData.isActive = mapElementData?.type === status;
      miniKpiMap.set(key, mapElementData);
    }
  }

  public getNextConfigFlow(
    supportTypeSelected: any,
    configSupportTypeSelected: any,
    selectedKpi: string
  ): any {
    // Variable control
    let nextStepsConfig: any = {};
    // Gets the first row of the flow (initial step)
    let Actualflow = configSupportTypeSelected.filter(
      (item: any) => item.codigo == 1
    );
    // Sort inside flow
    let sortedSteps = Actualflow[0].flujo.sort((a: any, b: any) => {
      return a.codigo - b.codigo;
    });

    // this finds the next step to go depends on which im satying
    let nextStep!: SortedStepsType;
    // this finds the next step to go depends on which im satying
    if (selectedKpi == "pending") {
      // Gets the first step "next" step to do
      nextStep = sortedSteps[0];
    } else {
      let actualSteps = configSupportTypeSelected[0]["flujo"];
      let valueKey = this.getMiniKpiKeyOrValue(selectedKpi, "value");
      let actualIndexStatus = actualSteps.findIndex((status: any) => {
        return (status.descripcion = valueKey);
      });
      let nextIndexStep = actualIndexStatus + 1;
      nextStep = actualSteps[nextIndexStep];
    }

    // This generates the key to reference the object
    // and creates the structure
    let flowKey = this.getMiniKpiKeyOrValue(nextStep.descripcion, "key");
    nextStepsConfig[flowKey] = true;
    return nextStepsConfig;
  }

  public changeActualStatus(status: string, folio: any): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/changeActualStatus`,
      { status, folio }
    );
  }

  public changeApplicationStatus(
    folio: any,
    file_object: any,
    body: any,
    type: string,
    response: (data: any) => void
  ): void {
    // this.changeActualStatus(actualStatus,folio).subscribe((success: any) => {
    //     response([{response: true,message:'La solicitud se ha mandado a validación exitosamente.'}]);
    //   },(error: any) => {
    //     response([{response: true,message:'La solicitud se ha mandado a validación exitosamente.'}]);
    //   }
    // );
    let actual_status_key = body["actualStatus"];
    let nextStatusKey = this.getMiniKpiKeyOrValue(actual_status_key, "value");

    if (type == "appendDocument") {
      //1 Change status
      this.http
        .post(
          `${environment.SOLICITUD_API}/v1/${this.tracking}/changeActualStatus`,
          body
        )
        .subscribe(
          (success_dictaminar) => {
            //2 Append files
            this.http
              .post(
                `${environment.SOLICITUD_API}/v1/${this.trackingApplication}/addEvidence`,
                this.createFormDataOneDocument(
                  folio,
                  file_object,
                  nextStatusKey
                )
              )
              .subscribe(
                (success) => {
                  response({ success: true });
                },
                (error) => {
                  this.toastr.error(
                    "Error al cambiar el estatus de la solicitud"
                  );
                  response({ success: false });
                }
              );
          },
          (error_dictaminar) => {
            response({ success: false });
          }
        );
    } else {
      // change status
      this.http
        .post(
          `${environment.SOLICITUD_API}/v1/${this.tracking}/changeActualStatus`,
          body
        )
        .subscribe(
          (success_dictaminar) => {
            response({ success: true });
          },
          (error_dictaminar) => {
            response({ success: false });
          }
        );
    }
  }

  public getConfigFlowFromSupportType(supportType: any): any {
    return this.http.post(
      `${environment.PROGRAM_API}/v1/program/getFlowOfSuportType`,
      { supportType }
    );
  }

  public getSupportFlow(
    actualSupportType: string,
    getData: (data: any) => void
  ) {
    this.getConfigFlowFromSupportType(actualSupportType).subscribe({
      next: (response: any) => {
        const result = response.result;
        if (response.success) {
          // TODO: CHECK THIS
          getData(result.length ? result[0]?.flujoSeguimiento : [])
        } else {
          getData(null);
        }
      },
      error: (error: any) => {
        getData(null);
      }
    });
  }

  public getTrackingConfigView(step: string): any {
    return this.http.post(
      `${environment.SOLICITUD_API}/v1/${this.tracking}/stepConfigView`,
      { step }
    );
  }

  public getAllSupportTypeSelect(response: (data: any) => void) {
    this.getAllSupportTypeForSelect().subscribe((success: any) => {
      response(success.result);
    });
  }
  public getAllSupportTypeForSelect(): any {
    return this.http.get(
      `${environment.PROGRAM_API}/v1/program/getAllSupportTypeForSelect`
    );
  }

  private showFile(
    blobFile: string | any,
    type: string = "application/pdf"
  ): void {
    const byteCharacters = atob(blobFile);
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

    const blob = new Blob(byteArrays, { type });
    var fileURL = URL.createObjectURL(blob);
    window.open(fileURL);
  }
}
