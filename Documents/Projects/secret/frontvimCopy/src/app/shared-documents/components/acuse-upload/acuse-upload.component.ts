import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ApplicationService, ProgramService } from "@app/data/services";
import { getStepConfiguration } from "@app/data/constants/cedula";
import { SessionEntity } from "@app/data/entities";
import { ProgramType } from "@app/data/types";
import { generate } from "@pdfme/generator";
import { template, generateInputsArray } from "@data/constants/solicitud";
import { Router } from "@angular/router";

@Component({
  selector: "app-acuse-upload",
  templateUrl: "./acuse-upload.component.html",
  styleUrls: ["./acuse-upload.component.scss"],
})
export class AcuseUploadComponent implements OnInit {
  @Input() folio: string = "";
  @Output() changeContent: EventEmitter<any> = new EventEmitter();
  //
  private sessionEntity = new SessionEntity();
  private vigencia: number = this.sessionEntity.viewingYear;
  public stepName: string = "acuse";
  //
  public stepConfig = getStepConfiguration(this.stepName, this.vigencia);
  //
  public file: File | null = null;

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private programService: ProgramService
  ) {
  }

  ngOnInit(): void {}

  /**
   * Handle download acuse btn click
   */
  onAcuseDownload(): void {
    this.applicationService.getAcuse(this.folio, (isSuccess) => {});
  }

  // public onDownload2023Format() {
  //   const url = `../../../../assets/files/AnexoSolicitud2023.pdf`;
  //   window.open(url, '_blank');
  // }

  public async onDownload2023Format() {
    const font = {
      century: {
        data: await fetch(
          "./assets/fonts/CenturyGothic/Century-Gothic.ttf"
        ).then((res) => res.arrayBuffer()),
        fallback: true,
      },
    };
    this.applicationService.getSolicitud(this.folio, (SolicitudData) => {
      this.programService.get(
        null,
        SolicitudData?.programa?.q,
        null,
        null,
        null,
        (program: any) => {
          let avisoUrl = program?.aviso?.url || "";
          const inputs = generateInputsArray(
            this.folio,
            SolicitudData,
            avisoUrl
          );
          generate({ template, inputs, options: { font } }).then((pdf: any) => {
            const blob = new Blob([pdf.buffer], {
              type: "application/pdf",
            });
            window.open(URL.createObjectURL(blob));
          });
        }
      );
    });
  }

  /**
   * Dropzone on file select event handler
   * @param {any} e Dropzone event, has te added files
   */
  public onSelect(e: any): void {
    this.file = e.addedFiles[0];
  }

  /**
   * Dropzone on remove file event handler
   */
  public onRemove(): void {
    this.file = null;
  }

  /**
   * Controls the "next button" disabled property.
   * Is disabled when not all the files are uploaded
   * @returns {boolean}
   */
  public isDisabled(): boolean {
    return this.file ? false : true;
  }

  /**
   * Handle next step event and emit the step data
   */
  public nextStep(): void {
    if (this.file) {
      this.changeContent.emit({
        isNext: true,
        step_action: -1,
        data: {
          name: this.stepConfig.show.solicitud ? "Solicitud" : "Acuse",
          value: this.getAcuseFile(),
        },
      });
    }
  }

  private getAcuseFile(): {
    data: any;
    files: Array<{ name: string; value: File }>;
  } {
    const result: { data: any; files: Array<{ name: string; value: File }> } = {
      data: {
        estandar: [],
      },
      files: [],
    };
    if (this.file) {
      const fileKey = this.stepConfig.show.solicitud
        ? `estandar_solicitud`
        : `estandar_acuse`;
      result.data.estandar.push({
        llave: fileKey,
        nombre: this.stepConfig.show.solicitud ? "Solicitud" : "Acuse",
        uid: "",
        fechaVigencia: new Date(),
      });
      result.files.push({
        name: fileKey,
        value: this.file,
      });
      return result;
    }
    return { data: [], files: [] };
  }
}
