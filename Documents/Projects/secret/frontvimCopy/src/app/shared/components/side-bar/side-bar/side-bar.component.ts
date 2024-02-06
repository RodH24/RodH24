import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import {
  TokenEntity,
  SessionEntity,
  ApplicationStorageEntity,
  FilterStorageEntity,
} from "@data/entities";
import { MenuFunctions, RedirectionFunctions } from "@data/functions";
import { environment } from "@env/environment";
import { roleType } from "@app/data/types";
import { SideBarService } from "@core/services/sidebar/sidebar.service";
import { AuthService } from "@core/services/auth/auth.service";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.scss"],
})
export class SideBarComponent implements OnInit {
  public readonly appVersion: string = environment.APP_VERSION;
  public token: TokenEntity;
  public session: SessionEntity;
  public roleList: any;
  public menuOptionsList: any;
  public selectedRole: string = "";
  /** Control yes/no modal show/hide */
  public showModal = false;
  public applicationStorageEntity = new ApplicationStorageEntity();

  get userPhoto() {
    return this.getUserPhoto();
  }

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private sideBarService: SideBarService,
    private authService: AuthService
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
    sideBarService.getSideBarStructure((structure: any) => {
      this.menuOptionsList = MenuFunctions.getMenuOptionList(
        this.session.permissionsList,
        structure,
        this.token.hasPeu
      );
    });
  }

  ngOnInit(): void {
    this.roleList = this.token.rolesVigentes(this.session.getViewingDate);
    this.selectedRole = this.token.getRolNameFromResponse(
      this.session.getActiveRole
    );
    const query = window.matchMedia("(max-width: 600px)");
    // for small devices
    if (query["matches"] === true) {
      this.onShowHideSidebar(false);
    } else {
      this.onShowHideSidebar(true);
    }
  }

  public onShowHideSidebar(show: boolean): void {
    const element: any = document.getElementsByClassName("page-wrapper")[0];
    if (show) {
      element.classList.remove("untoggled");
      element.classList.add("toggled");
    } else {
      element.classList.add("untoggled");
      element.classList.remove("toggled");
    }
  }

  public onLogOutClick(option: boolean): void {
    if (option) {
      const filterStorage = new FilterStorageEntity();
      this.token.logOut();
      this.session.logOut();
      this.applicationStorageEntity.deletePermissions();
      filterStorage.clearAll();
      RedirectionFunctions.redirectToLogin(this.router);
    }
    this.showModal = false;
  }

  public onChangeRole(key: string): void {
    let roleToFind: roleType = <roleType>{};
    roleToFind.key = key;
    let role: roleType = this.token.findRolObject(roleToFind);
    if (role) {
      this.authService.changeActiveRole(
        this.token.email,
        role.id,
        this.session.getViewingDate,
        (success, role, permissions) => {
          if (success) {
            this.session.setPermissionsData = {
              permissions: permissions,
              activeRole: <roleType>role,
            };
            RedirectionFunctions.redirectToMainPage(this.router, role);
          }
        }
      );
    }
  }

  public getUserPhoto(): string {
    return this.token.photo ?? "../../../../../assets/images/iconos/users/user.jpg";
  }
}
