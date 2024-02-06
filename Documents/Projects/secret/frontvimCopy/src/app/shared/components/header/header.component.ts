import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { TokenEntity, SessionEntity } from "@app/data/entities";
import { DateFunctions, RedirectionFunctions } from "@data/functions";
import { AuthService } from "@core/services/auth/auth.service";
import { roleType } from "@app/data/types";
import * as moment from "moment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public token: TokenEntity;
  public session: SessionEntity;
  public activeYear: number = new Date().getFullYear();
  public arrYears: Array<number> = [];
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
    let thisInside = this;
    this.token?.roles.forEach(function (role: any) {
      let firstYear = moment(role.vigencia.inicio).utc().year();
      let dateFin = role.vigencia.fin === null ? new Date() : role.vigencia.fin;
      let lastYear = moment(dateFin).utc().year();
      for (let i = firstYear; i <= lastYear; i++) {
        if (!thisInside.arrYears.includes(i)) thisInside.arrYears.push(i);
      }
    });
    thisInside.arrYears.sort();
    const sessionEntity = new SessionEntity();
    this.activeYear = sessionEntity.viewingYear;
  }

  ngOnInit(): void {}

  private getViewingData(year: number): any {
    const range = DateFunctions.getCleanDateRange(year.toString());
    return range;
  }

  public onChangeViewgingDate(year: number): void {
    const sessionEntity = new SessionEntity();
    let roleToFind: roleType = sessionEntity.getActiveRole;
    let roleToChange: roleType = this.token.findRolObject(roleToFind);
    let newViewingDate = this.getViewingData(year);

    if (roleToChange) {
      this.authService.changeActiveRole(
        this.token.email,
        roleToChange.id,
        newViewingDate,
        (success, role, permissions) => {
          if (success) {
            this.session.setViewingDate = newViewingDate;
            this.session.setPermissionsData = {
              permissions: permissions,
              activeRole: <roleType>role,
            };
            RedirectionFunctions.redirectToMainPage(this.router, role);
            return;
          }
          RedirectionFunctions.redirectToMainPage(this.router, roleToChange);
        }
      );
    }
  }
}
