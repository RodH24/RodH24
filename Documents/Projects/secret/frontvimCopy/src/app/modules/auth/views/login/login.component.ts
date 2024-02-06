import { Component, OnInit, Inject, NgZone } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { TokenEntity, SessionEntity } from "@data/entities";
import { RedirectionFunctions } from "@data/functions";
import { AuthService } from "@core/services/auth/auth.service";
import { roleType } from "@app/data/types";
import { aviso } from "@app/data/constants/formatos";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public showUserModal: boolean = false;
  public googleToken: any = "";
  public showAvisoPrivacidadModal: boolean = false;
  public avisoMsg = aviso;
  private token: TokenEntity;
  private session: SessionEntity;

  /**
   * @constructor
   * @param {Document} document - Inject document to get a reference of browser window object.
   * @param {NgZone} ngZone - Angular Zone Class to manage events in google auth subscription.
   * @param {Router} router - Angular Router Service.
   * @param {FormBuilder} formBuilder - FormBuilder for Angular Reactive Forms.
   * @param {ToastrService} toastr - Toastr Service, to show toasts messages.
   * @param {CookieService} cookieService - Service to handle cookies.
   * @param {AuthService} authService - Authentication service.
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.token = new TokenEntity(this.cookieService);
    this.session = new SessionEntity();
    this.loginForm = this.formBuilder.group({
      user: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      remember: [true],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // this.initializeGoogleOauthService();
  }

  public onCloseModal(): void {
    this.showUserModal = false;
  }

  public acceptAvisoPrivacidad(isAccept: boolean): void {
    if (isAccept) {
      this.showAvisoPrivacidadModal = false;
      this.authService.acceptAvisoPrivacidad(this.token.userId, (isSuccess) => {
        if (isSuccess) {
          this.redirectToMainPage();
        } else {
          this.token.logOut();
        }
      });
    }
  }

  private redirectToMainPage(): void {
    const roleToFind: roleType = <roleType>{};
    roleToFind.id = this.session.getActiveRole.id;
    const selectedRole = this.token.findRolObject(roleToFind);
    RedirectionFunctions.redirectToMainPage(this.router, selectedRole);
  }

  loginWithGoogle() {
    this.authService
      .loginWithGoogle()
      .then((success: any) => {
        const token = success["_tokenResponse"]["idToken"];
        this.googleToken = token;
        this.authService.authLogin(
          token,
          ({
            success,
            token,
            permissions,
            showAvisoPrivacidad,
            userRolesInfo,
          }) => {
            if (success && token !== "" && token !== "" && token !== "") {
              // assing value to token
              this.token.value = token;
              this.token.rolesValue = userRolesInfo;
              this.showAvisoPrivacidadModal = showAvisoPrivacidad;
              // get actual role data
              const role = this.token.roles.find(function (role) {
                return role.active == true;
              });
              //define viewing date
              this.session.setViewingDate = this.token.tokenViewingDate
                ? this.token.tokenViewingDate
                : null;
              // define permission for session enity
              this.session.setPermissionsData = {
                permissions: permissions,
                activeRole: role,
              };

              if (!showAvisoPrivacidad) {
                this.redirectToMainPage();
              }
            } else if (success && token === "") {
              this.showUserModal = true;
            }
          }
        );
      })
      .catch((e: any) => {
        this.toastr.error("Hubo un error al iniciar la sesión.");
      });
  }
}
