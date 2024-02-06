import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormArray,
  UntypedFormControl,
} from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { NzTabPosition } from "ng-zorro-antd/tabs";
import {
  TrackingFlowService,
  ApplicationService,
  AcuseService,
  ProgramService,
} from "@data/services";
import { PaginatorEntity, SessionEntity, TokenEntity } from "@data/entities";
import { impulseZonesgtoGeoJson } from "src/assets/maps/222_zonas_23Marzo2022";
import { gtoGeoJson } from "src/assets/files/gto";
import decode from "jwt-decode";
import * as JSZip from "jszip";
import * as L from "leaflet";
import { saveAs } from "file-saver";
import { generate } from "@pdfme/generator";
import { template, generateInputsArray } from "@data/constants/solicitud";
import * as base64js from 'base64-js';

@Component({
  selector: "pending-modal",
  templateUrl: "./modal-ficha-ciudadana.component.html",
  styleUrls: ["./modal-ficha-ciudadana.component.scss"],
})
export class ModalFichaCiudadanaComponent implements OnInit, AfterViewInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = "";
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{
    event: boolean;
    modalName: string;
  }>();

  public session: SessionEntity = new SessionEntity();
  public token: TokenEntity;
  public nzTitle: string = "Solicitud";
  public reject_list: Array<any> = [];
  public map: any;
  public historical_data: Array<any> = [];
  public isAcceptModal: boolean = false;
  public showModal: boolean = false;
  public data: any;
  public standar_documents: Array<any> = [];
  public specific_documents: Array<any> = [];
  public evidences_documents: Array<any> = [];
  public show_reject_modal: boolean = false;
  public formData: UntypedFormGroup;
  public tabSet: Array<any> = [];
  // Form dynamic for requirement list
  public formRequirements: UntypedFormGroup;
  public requirementsData: Array<any> = [];
  public completed: number = 0;
  public totalRequirement: number = 0;
  public weighing_list: Array<any> = [];
  public total_weigh: number = 0;
  public hasCedula: boolean = false;
  public living_place: string = "";
  public paginator: PaginatorEntity = new PaginatorEntity();
  public documents: any = {};
  public files: {
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
  public effect = "scrollx";
  public docsCheked: boolean = false;
  public p: any;
  public temp_comments: Array<{
    folio: string;
    nombre: string;
    tipo: string;
    observaciones?: string;
  }> = [];
  public temp_comments_true: Array<{
    folio: string;
    nombre: string;
    tipo: string;
    observaciones?: string;
  }> = [];
  public enable_btn_to_comment: boolean = false;
  public enable_btn_to_validate: boolean = false;
  public enable_fom_requirements: boolean = false;
  public total_comments: number = 0;
  public total_written_comments: number = 0;
  public total_actions: number = 0;
  public click_actions: number = 0;
  public control_validation: Array<any> = [];
  public nzTabPosition: NzTabPosition = "top";
  public selectedIndex = 0;
  public captureUser: string = "";
  public showCancelModal: boolean = false;
  public existsCedula: boolean = false;
  public supportTypeSelected: string = "";
  public configSupportTypeSelected: Array<any> = [];
  public viewConfigForYear: any = {};
  public vigencia = this.session.viewingYear;

  // ====================================
  // =========== Control flow ===========
  // ====================================

  public nextStepsConfig: any = {
    validated: true,
  };

  get standardDocuments(): Array<any> {
    return this.modalData?.documentos.estandar ?? [];
  }
  get specificDocuments(): Array<any> {
    return this.modalData?.documentos.especifico ?? [];
  }
  get allDocuments(): Array<any> {
    return [...this.standar_documents, ...this.specific_documents, ...this.evidences_documents];
  }
  get solicitudStandardDocuments(): Array<any> {
    return this.documents.estandar;
  }
  get solicitudProgramDocuments(): Array<any> {
    return this.documents.especifico;
  }
  get requirementsFormArray() {
    return this.formRequirements.controls.requirements as UntypedFormArray;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService,
    private applicationService: ApplicationService,
    private acuseService: AcuseService,
    private programService: ProgramService
  ) {
    this.token = new TokenEntity(this.cookieService);

    this.formData = this.formBuilder.group({
      select_reason: ["", [Validators.required]],
      text_reason: [""],
    });

    // For requirements list
    this.formRequirements = this.formBuilder.group({
      requirements: new UntypedFormArray([], this.validateIfAllSelected()),
    });
  }
  ngOnInit(): void {
    if (this.modalData.cedula) {
      this.existsCedula = true;
    } else {
      this.existsCedula = false;
    }

    this.nzTitle = "Solicitud:  " + this.modalData.folio;
    this.data = this.modalData.ciudadano;
    this.captureUser = this.modalData?.usuarioCampo?.nombre;
    this.standar_documents = this.modalData.documentos.estandar;
    this.specific_documents = this.modalData.documentos.especifico;
    this.evidences_documents = (this.modalData.documentos.evidencia) ? (this.modalData.documentos.evidencia) : this.evidences_documents;
    this.total_actions =
      this.standar_documents.length + this.specific_documents.length;
    this.fillWeighingTable();
    this.getHistorical();
    this.getRequirements(
      this.modalData["programa"]["modalidad"]["tipoApoyo"]["clave"]
    );
    this.documents = this.modalData.documentos;
    this.getDocumentUrl();
    this.getConfigForYear();
  }

  ngAfterViewInit() {
    this.configureView();
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }

  public getConfigForYear() {
    this.trackingFlowService.getTrackingConfigView("pending").subscribe(
      (success: any) => {
        let actualConfigView = success["result"]["pending"];
        let tabsArray = actualConfigView["tabs"]["list"];

        // this fills the tab section
        for (let item in tabsArray[0]) {
          if (tabsArray[0][item]["appear"] === true) {
            this.tabSet.push(tabsArray[0][item]);
          }
        }
        // this fills the modal section
        for (let item in actualConfigView) {
          if (actualConfigView[item]["appear"] === true) {
            this.viewConfigForYear[item] = true;
          } else {
            this.viewConfigForYear[item] = false;
          }
        }
      },
      (error: any) => {
        console.log("❌ Error: ", error);
      }
    );
  }

  // function to execute when click on tabs
  log(args: any[]): void { }

  public configureView(config: Array<any> = this.configSelected) {
    let tempConf = config;

    this.nextStepsConfig = this.trackingFlowService.getNextConfigFlow(
      tempConf[0],
      tempConf[1],
      this.selectedKpi
    );
  }

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

  private getHistorical(): void {
    let curp = this.modalData["ciudadano"]["curp"];

    this.trackingFlowService.listHistoricalApplications(
      curp,
      this.paginator.page,
      ({ list, total }) => {
        this.historical_data = list;
        this.paginator.total = total;
      }
    );
  }

  private initMap(): void {
    let coordinates_of_living: Array<any> = [];

    if (
      this.modalData["ciudadano"]["domicilio"]["georeferencia"]["coordinates"]
        .length == 0
    ) {
      coordinates_of_living = [21.0181, -101.258];
    } else {
      coordinates_of_living =
        this.modalData["ciudadano"]["domicilio"]["georeferencia"][
        "coordinates"
        ];
    }
    //Here we have to reverse the coordinates to show point on map
    let y = coordinates_of_living[0];
    let x = coordinates_of_living[1];

    this.map = new L.Map("map");

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://dgtit.guanajuato.gob.mx/#/"> | DGTIT | </a>',
      maxZoom: 18,
    }).addTo(this.map);

    // To hide powered by leaflet
    this.map.attributionControl.setPrefix("");

    var custom_icon = L.icon({
      iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
      iconSize: [38, 95],
      iconAnchor: [20, 70],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker(coordinates_of_living, { icon: custom_icon });
    marker.addTo(this.map);

    let estilosGto = {
      color: "#F25230",
      weight: 1,
      opacity: 0.65,
    };

    L.geoJSON(impulseZonesgtoGeoJson, {
      style: estilosGto,
    }).addTo(this.map);

    // Color for gto state
    let gtoStyles = {
      color: "#12A2A2",
      weight: 1,
      opacity: 0.65,
    };

    L.geoJSON(gtoGeoJson, {
      style: gtoStyles,
    }).addTo(this.map);

    this.map.setView(coordinates_of_living, 15);
  }

  private fillWeighingTable() {
    if (this.modalData["cedulaImpulso"] === false) {
      this.hasCedula = false;
    } else {
      this.hasCedula = true;
      this.weighing_list = [
        {
          title: "Ciudadano",
          number: this.modalData["ciudadano"]["puntaje"],
        },
        {
          title: "Hogar",
          number: this.modalData["cedula"]["datosHogar"]["puntaje"],
        },
        {
          title: "Salud",
          number: this.modalData["cedula"]["datosSalud"]["puntaje"],
        },
        {
          title: "Educación",
          number: this.modalData["cedula"]["datosEducacion"]["puntaje"],
        },
        {
          title: "Ingresos",
          number: this.modalData["cedula"]["datosIngreso"]["puntaje"],
        },
        {
          title: "Alimentación",
          number: this.modalData["cedula"]["datosAlimentacion"]["puntaje"],
        },
      ];
    }
    this.sumWeigh();
  }

  public sumWeigh = () => {
    this.weighing_list.forEach((value: any) => {
      this.total_weigh = this.total_weigh + value["number"];
    });
  };

  public validateIfAllSelected() {
    let validator: any = (formArray: UntypedFormArray) => {
      let totalSelected = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);
      this.completed = totalSelected;
      this.totalRequirement = formArray.controls.length;

      return totalSelected == formArray.controls.length
        ? null
        : { required: true };
    };

    return validator;
  }

  private addCheckboxes() {
    this.requirementsData.forEach(() =>
      this.requirementsFormArray.push(new UntypedFormControl(false))
    );
  }

  public getRequirements(clave: string) {
    this.trackingFlowService.getRequirements(clave).subscribe(
      (success: any) => {
        let response_requirement =
          success["result"]["programa"]["modalidades"]["elegibilidad"][
          "criterios"
          ];
        let new_requirements = [];
        // add formcontrolname
        for (let m in response_requirement) {
          response_requirement[m]["formControlName"] =
            response_requirement[m]["orden"] + "_requirement";
          new_requirements.push(response_requirement[m]);
        }
        this.requirementsData = new_requirements;
        this.addCheckboxes();
      },
      (error: any) => {
        this.toastr.error("Hubo un error al obtener los catalogos: ", error);
      }
    );
  }

  public getUsrData = (): any => {
    let token: any = decode(this.token.value);

    let usuarioCaptura = {
      id: token.uid,
      nombre: token.name,
      email: token.email,
      codigoRol: token.roleCode,
      rol: token.roleName,
    };

    return usuarioCaptura;
  };

  public rejectApplication = () => {
    this.spinner.show();

    let usr_data = this.getUsrData();

    let actual_state = {
      codigo: this.modalData.estatusActual.codigo,
      descripcion: this.modalData.estatusActual.descripcion,
    };

    let body = {
      form_data: this.formData.value,
      usr_data: usr_data,
      actual_state: actual_state,
      folio: this.modalData.folio,
    };

    let body_stringify = JSON.stringify(body);

    this.trackingFlowService.rejectApplication(body_stringify).subscribe(
      (success: any) => {
        this.spinner.hide();
        this.toastr.success("Se rechazó la solicitud exitosamente");
        this.interactRejectModal();
        this.onHideModalClick();
        this.applicationUpdateEvent.emit({
          event: true,
          modalName: "pendientes",
        });
      },
      (error: any) => {
        this.toastr.error("Hubo un error al rechazar la solicitud: ", error);
        this.spinner.hide();
      }
    );
  };

  public interactRejectModal = () => {
    this.show_reject_modal = !this.show_reject_modal;
  };

  public interactCancelModal() {
    this.showCancelModal = !this.showCancelModal;
  }

  public fullscreen = () => {
    var elem: any = document.getElementById("modal-requirement");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
    this.getHistorical();
  }

  public fileExists(documents: any, key: string): boolean {
    if (documents) {
      // Search the name of the file on the docs structure
      return documents.some((obj: any) => obj.nombre == key);
    }
    return false;
  }

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

  public onRemove(type: string = "estandar", name: string = "CURP"): void {
    delete this.files[type][name];
  }

  public getFileUrl(documents: any, key: string): any {
    for (let m in documents) {
      if (documents[m]["nombre"] == key) {
        return documents[m]["signedUrl"];
      }
    }
  }

  public onSelect(e: any, type: string = "estandar", name = "CURP"): void {
    const newItem = {
      fechaVigencia: "",
      file: e.addedFiles[0],
    };
    this.files[type][name] = newItem;
  }

  public isUploadSelected(documents: any, key: string): boolean {
    if (documents) {
      return documents[key]?.selected ?? false;
    }
    return false;
  }

  /*************************************
   * This executes on click of button  *
   * to show input comments ***********/
  onSelectedStatusChange(item: any, event: any, tipo: string) {
    // Here is the object recovered
    let item_selected: {
      nombre: string;
      value?: boolean;
      comments: string;
      type: string;
    } = { nombre: item.nombre, comments: "", type: tipo };

    if (event === true) {
      item["check_selected"] = true;
      item_selected["value"] = true;
      // this.validateEnableBtn();
    } else {
      // this enables the comments input
      item["check_selected"] = false;
      item_selected["value"] = false;
    }

    // Exist the selected value on the array of values selected
    let object_exists = this.control_validation.find((element) => {
      if (element.nombre == item.nombre) {
        return true;
      } else {
        return false;
      }
    });
    // exists on array
    if (object_exists !== undefined) {
      if (event === false) {
        // CLick on false button
        // change status to the object to false value
        for (let m in this.control_validation) {
          if (this.control_validation[m].nombre == item.nombre) {
            this.control_validation[m].value = false;
          }
        }
      } else {
        for (let m in this.control_validation) {
          if (this.control_validation[m].nombre == item.nombre) {
            this.control_validation[m].value = true;
            this.control_validation[m].comments = "";
          }
        }
      }
    } else {
      // push new object
      this.control_validation.push(item_selected);
    }

    this.validateEnableBtn();

    // to enable the action button it has to validate the values on true
    let isSomeValueOnFalse = this.control_validation.some(
      (obj: any) => obj.value == false
    );
    // This hide the validate button and show the send to observation button
    if (isSomeValueOnFalse === false) {
      this.docsCheked = true;
    } else {
      this.docsCheked = false;
    }
  }
  public sendForObservation(): void {
    if (this.control_validation.length >= 1) {
      this.spinner.show();
      setTimeout(() => {
        let arr_standard: Array<{ nombre: string; observaciones?: string }> =
          [];
        let arr_specific: Array<{ nombre: string; observaciones?: string }> =
          [];
        for (let m of this.control_validation) {
          if (m["type"] == "estandar") {
            if (m["comments"].length >= 1) {
              arr_standard.push({
                nombre: m["nombre"],
                observaciones: m["comments"],
              });
            } else {
              arr_standard.push({
                nombre: m["nombre"],
              });
            }
          } else {
            if (m["comments"].length >= 1) {
              arr_specific.push({
                nombre: m["nombre"],
                observaciones: m["comments"],
              });
            } else {
              arr_specific.push({
                nombre: m["nombre"],
              });
            }
          }
        }

        let new_structure = {
          folio: this.modalData.folio,
          comments: {
            estandar: arr_standard,
            especifico: arr_specific,
          },
        };

        this.trackingFlowService
          .sendRequestForObservation(new_structure)
          .subscribe(
            (success: any) => {
              this.spinner.hide();
              this.toastr.success(
                "La solicitud se ha mandado a validación exitosamente."
              );
              this.onHideModalClick();
              this.applicationUpdateEvent.emit({
                event: true,
                modalName: "pendientes",
              });
            },
            (error: any) => {
              this.toastr.error(
                "Hubo un error al ingresar las observaciones: ",
                error
              );
              this.spinner.hide();
            }
          );
      }, 500);
    } else {
      this.toastr.warning(
        "Cuidado, no puedes validar la solicitud si tienes comentarios en los documentos"
      );
    }
  }
  public validateEnableBtn() {
    // Enable the btn to send comments
    let count_comments = 0;
    let count_fails = 0;
    let total_docs = 0;

    for (let m of this.control_validation) {
      total_docs = total_docs + 1;
      if (m["comments"].length >= 1) {
        count_comments = count_comments + 1;
      }
      if (m["value"] == false) {
        count_fails = count_fails + 1;
      }
    }

    let count_standard_documents = this.modalData?.documentos.estandar.length;
    let count_specific_documents = this.modalData?.documentos.especifico.length;
    let total_documents = count_standard_documents + count_specific_documents;

    if (
      count_comments == 0 &&
      count_fails == 0 &&
      total_docs == total_documents
    ) {
      if (this.formRequirements.invalid) {
        // INCOMPLETE
        this.enable_btn_to_validate = false;
      } else {
        // COMPLETE
        this.enable_btn_to_validate = true;
      }
    } else {
      this.enable_btn_to_validate = false;
    }
    // validate comment button
    if (count_comments == count_fails && total_docs == total_documents) {
      this.enable_btn_to_comment = true;
    } else {
      this.enable_btn_to_comment = false;
    }
  }
  public testing(event: any) {
    this.validateEnableBtn();
  }
  public txtAreaValue(event: any, file_name: string, type: any): void {
    // Search the object on the array and modify the comment key
    for (let m of this.control_validation) {
      if (m["nombre"] == file_name) {
        m["comments"] = event.target.value;
      }
    }
    this.validateEnableBtn();
  }
  public changeCheck(event: any) {
    if (this.formRequirements.invalid) {
      // INCOMPLETE
      this.enable_btn_to_validate = false;
    } else {
      // COMPLETE
      this.enable_btn_to_validate = true;
    }
  }
  public onOpenCitizenFileClick(): void {
    window.open(this.modalData.citizenFileUrl, "_blank");
  }
  public onOpenSubModalClick(isAcceptModal: boolean): void {
    this.isAcceptModal = isAcceptModal;
    this.showModal = true;
  }
  public onCloseSubModalClick() {
    this.showModal = false;
  }
  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }
  public showPdf(isCedula: boolean = true) {
    this.acuseService.getFileByFolio(
      this.vigencia,
      this.modalData.folio,
      isCedula
    );
  }
  getAcuse(): void {
    this.applicationService.getAcuse(this.modalData.folio, (isSuccess) => { });
  }
  public downloadFile = (document: any) => {
    let url_path = document.fileList[0].urlPath;

    this.spinner.show();
    this.trackingFlowService.downloadFile(url_path).subscribe(
      (success: any) => {
        this.spinner.hide();
        window.open(success.result.signedRequest, "_blank");
      },
      (error: any) => {
        this.toastr.error("Hubo un error al descargar el archivo: ", error);
        this.spinner.hide();
      }
    );
  };

  public downloadZip(documentArray: any) {
    let finalList: Array<string> = [];
    this.spinner.show();
    let control = 0;

    for (let file of documentArray) {
      let signedUrl: any = file.fileList[0].urlPath;
      this.trackingFlowService.downloadFile(signedUrl).subscribe((success: any) => {
        finalList.push(success.result.signedRequest);
        control++;
        if (control == documentArray.length) {
          this.trackingFlowService.downloadFolioZip(finalList, this.modalData.folio).subscribe((final_success: any) => {
          },
            (error: any) => {
              console.log('error: ',error);
            }
          );
        }
      },
        (error: any) => {
          this.toastr.error("Hubo un error al descargar el archivo: ", error);
          this.spinner.hide();
        }
      );
    }
  }

  public async downloadSolicitud() {
    const font = {
      century: {
        data: await fetch(
          "./assets/fonts/CenturyGothic/Century-Gothic.ttf"
        ).then((res) => res.arrayBuffer()),
        fallback: true,
      },
    };
    this.applicationService.getSolicitud(
      this.modalData.folio,
      (SolicitudData) => {
        this.programService.get(
          null,
          SolicitudData?.programa?.q,
          null,
          null,
          null,
          (program) => {
            let avisoUrl = program?.aviso?.url || "";
            const inputs = generateInputsArray(
              this.modalData.folio,
              SolicitudData,
              avisoUrl
            );
            generate({ template, inputs, options: { font } }).then(
              (pdf: any) => {
                const blob = new Blob([pdf.buffer], {
                  type: "application/pdf",
                });
                window.open(URL.createObjectURL(blob));
              }
            );
          }
        );
      }
    );
  }
  public downloadZipByQ() {
    this.spinner.show();
    let selectedQ: string = 'Q1417';
    this.trackingFlowService.downloadZipByQ(selectedQ).subscribe((success: any) => {
      this.spinner.hide();
      var a = document.createElement("a");
      a.href = success["result"]["result"];
      a.click();
    },
      (error: any) => {
        this.toastr.error("Hubo un error al descargar el archivo: ", error);
        this.spinner.hide();
      });;
  }


  saveZip = (filename: any, urls: any) => {
    if (!urls) return;

    let zip = new JSZip();
    const folder: any = zip.folder("files");
    let config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    urls.forEach((url: any) => {
      const blobPromise = fetch(url).then((r) => {
        if (r.status === 200) {
          return r.blob();
        } else {
          return Promise.reject(new Error(r.statusText));
        }
      });
      const name = url.substring(url.lastIndexOf("/") + 1);
      folder.file(name, blobPromise);
    });

    zip.generateAsync({ type: "blob" }).then((blob: any) => {
      saveAs(blob, filename);
    });
  };

  onApplicationUpdate($event: any) {
    this.onHideModalClick();
    this.applicationUpdateEvent.emit({ event: true, modalName: "pendientes" });
  }

  /*********************************
   * CHANGE STATUS FOR APPLICATION *
   *********************************/
  public changeActualApplicationStatus() {
    let actualStatus: string = Object.keys(this.nextStepsConfig)[0];
    // this.spinner.show();
    //   let folio = this.modalData['folio'];
    //   let usr_data = this.getUsrData();
    //   let actual_state = {
    //     codigo: this.modalData['estatusActual']['codigo'],
    //     descripcion: this.modalData['estatusActual']['descripcion']
    //   }
    //   let body = {
    //     actualStatus:actualStatus,
    //     usr_data: usr_data,
    //     actual_state: actual_state,
    //     folio: this.modalData['folio'],
    //   }

    //   let body_stringify = JSON.stringify(body);
    // this.spinner.show();
    // this.trackingFlowService.changeApplicationStatus(folio, {}, body_stringify, 'doesntAppendDocument', (success: any) => {
    //   this.spinner.hide();
    //   this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
    //   this.interactRejectModal();
    //   this.onHideModalClick();
    //   this.applicationUpdateEvent.emit({ event: true, modalName: 'aprobadas' });
    // });
    let folio = this.modalData['folio'];
    let usr_data = this.getUsrData();
    let actual_state = {
      codigo: this.modalData['estatusActual']['codigo'],
      descripcion: this.modalData['estatusActual']['descripcion']
    }
    let body = {
      nextStatus: actualStatus,
      usr_data: usr_data,
      actual_state: actual_state,
      folio: this.modalData['folio'],
    }

    this.trackingFlowService.changeApplicationStatus(folio, {}, body, 'doesntAppendDocument', (success: any) => {
      this.spinner.hide();
      this.toastr.success('La solicitud se ha cambiado de status exitosamente.')
      this.interactRejectModal();
      this.onHideModalClick();
      this.applicationUpdateEvent.emit({ event: true, modalName: 'aprobadas' });
    });
  }
}
