import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { ToastrService } from "ngx-toastr";
import { ResponseFunctions } from "@app/data/functions";

@Injectable({
  providedIn: "root",
})
export class AcuseService {
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public getPrefolioFile(modalidad: string, quantity: string): void {
    this.toastr.info(
      "Se está generando el documento, está operación puede tardar unos minutos. Se descargará automáticamente cuando esté listo.",
      "Formato de Firma y Acuse"
    );
    this.httpClient
      .get(
        `${environment.ACUSE_API}/genAcuse.php?Q=${modalidad}&foliosExtras&nfolios=${quantity}&tipo=F&blob`
      )
      .pipe()
      .subscribe(
        (response: any) => {
          this.showFile(response.pdf);
        },
        (error) => {
          this.toastr.error(
            "Ocurrió un error al generar los folios, por favor inténtelo de nuevo más tarde.",
            "Formato de Firma y Acuse Prefoliado"
          );
        }
      );
  }

  public getAcuseByFolio(folio: string) {
    const url = `${environment.ACUSE_API}/VentanillaImpulso/Acuse.php?folio=${folio}&blob`;

    this.httpClient
      .get(url)
      .pipe()
      .subscribe(
        (response: any) => {
          if (response.pdf) {
            this.showFile(response.pdf);
          } else {
            this.toastr.error(
              "Error al generar el archivo",
              "No fue posible encontrar el Formato de Firma y Acuse del folio indicado"
            );
          }
        },
        (error) => {
          this.toastr.error(
            "No fue posible generar el archivo",
            "Formato de Firma y Acuse Prefoliado"
          );
        }
      );
  }

  public getFileByFolio(
    vigencia: number,
    folio: string,
    isCedula: boolean = true
  ) {
    if (vigencia !== 2022) {
      const fileURL = `${environment.SOLICITUD_API}/v1/application/download/solicitud/${folio}`;
      window.open(fileURL);
    } else {
      const url = `${environment.ACUSE_API}/VentanillaImpulso/${
        isCedula ? "Cedula" : "Solicitud"
      }.php?folio=${folio}&blob`;
      this.httpClient
        .get(url)
        .pipe()
        .subscribe({
          next: (response: any) => {
            this.showFile(response.pdf);
          },
          error: (error) => {
            this.toastr.error(
              "Ocurrió un error al generar los folios, por favor inténtelo de nuevo más tarde.",
              "Formato de Firma y Acuse Prefoliado"
            );
          },
        });
    }
  }

  public get(folio: string, isCedula: boolean = true) {
    const url = `${environment.ACUSE_API}/VentanillaImpulso/${
      isCedula ? "Cedula" : "Solicitud"
    }.php?folio=${folio}&blob`;

    this.httpClient
      .get(url)
      .pipe()
      .subscribe(
        (response: any) => {
          this.showFile(response.pdf);
        },
        (error) => {
          this.toastr.error(
            "Ocurrió un error al generar los folios, por favor inténtelo de nuevo más tarde.",
            "Formato de Firma y Acuse Prefoliado"
          );
        }
      );
  }

  public getExcelReport(
    status: string | null = null,
    isSuccess: (isSuccess: boolean) => void
  ) {
    const url = `${environment.SOLICITUD_API}/v1/files/${
      status ? "delivered" : "status"
    }`;

    this.httpClient
      .post(url, { status: status ?? "" })
      .pipe()
      .subscribe(
        (response: any) => {
          this.showFile(
            response.result,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;"
          );
          return isSuccess(true);
        },
        (error) => {
          this.toastr.error(
            "Ocurrió un error al generar el reporte, por favor inténtelo de nuevo más tarde.",
            "Reporte de Excel"
          );
          return isSuccess(false);
        }
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
