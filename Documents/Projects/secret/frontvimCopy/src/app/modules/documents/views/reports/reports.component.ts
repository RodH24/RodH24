import { Component, OnInit } from "@angular/core";
import { TokenEntity } from "@app/data/entities";
import { AcuseService } from "@app/data/services";
import { CookieService } from "ngx-cookie-service";
import swal from "sweetalert2";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  public token: TokenEntity;
  public isRepotBtnDisabled: boolean = false;
  public showGenAlert: boolean = false;
  public showSuccess: boolean = true;

  constructor(
    private cookieService: CookieService,
    private acuseService: AcuseService
  ) {
    this.token = new TokenEntity(this.cookieService);
  }

  ngOnInit(): void {
  }

  public onGenerateExcel(status: string | null) {
    this.isRepotBtnDisabled = true;
    this.acuseService.getExcelReport(status, (success: boolean) => {
      this.isRepotBtnDisabled = false;
      this.showSuccessAlert();
    });
  }

  private showSuccessAlert(): void {
    swal.fire({
      title: "",
      text: "El reporte se ha generado correctamente",
      icon: 'success',
      timer: 3000,
      showConfirmButton:false,
    });
  }
}
