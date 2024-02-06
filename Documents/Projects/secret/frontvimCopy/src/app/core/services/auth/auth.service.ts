import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { environment } from "@env/environment";
import { Auth, GoogleAuthProvider, signInWithPopup } from "@angular/fire/auth";
import { ResponseFunctions } from "@app/data/functions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private headers: any;

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    public injector: Injector
  ) {
    this.headers = new HttpHeaders()
      .set(
        "Authorization",
        `Bearer ${environment.GEG_IMPULSO_AUTH_TOKEN_API_KEY}`
      )
      .set("nonLogged", "true");
  }

  authLogin(
    token: string,
    isLogged: (data: {
      success: boolean;
      token: string;
      permissions: any;
      showAvisoPrivacidad: boolean;
      userRolesInfo: string;
    }) => void
  ): void {
    this.httpClient
      .post(
        `${environment.LOGIN_API}/v1/user/loginGoogle`,
        { token },
        { headers: this.headers }
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            if (response.result.hasOwnProperty("token")) {
              isLogged({
                success: true,
                token: response.result.token,
                permissions: response.result.permissions,
                showAvisoPrivacidad: response.result.showAvisoPrivacidad,
                userRolesInfo: response.result.userRolesInfo,
              });
              return;
            }
          } else if (
            !response.success &&
            response.message.includes("registered")
          ) {
            this.toastr.info(
              "Por favor ingrese su información",
              "El usuario no está registrado",
              {
                timeOut: 5000,
                positionClass: "toast-top-center",
              }
            );
            isLogged({
              success: true,
              token: "",
              permissions: [],
              showAvisoPrivacidad: false,
              userRolesInfo: "",
            });
            return;
          } else {
            this.toastr.warning(
              "Lo sentimos, el usuario no está autorizado para utilizar esta aplicación.",
              "Contacte al Administrador",
              {
                timeOut: 5000,
                positionClass: "toast-top-center",
              }
            );
          }
          isLogged({
            success: false,
            token: "",
            permissions: [],
            showAvisoPrivacidad: false,
            userRolesInfo: "",
          });
          return;
        },
        (error) => {
          isLogged({
            success: false,
            token: "",
            permissions: [],
            showAvisoPrivacidad: false,
            userRolesInfo: "",
          });
          this.toastr.error("Hubo un problema al procesar su solicitud.");
        }
      );
  }

  loginWithGoogle() {
    let auth = this.injector.get(Auth);
    return signInWithPopup(auth, new GoogleAuthProvider());
  }

  changeActiveRole(
    user: string,
    roleId: string,
    viewingDate: string | object | null,
    changeRole: (success: boolean, role: any, permissions: any) => void
  ): void {
    this.httpClient
      .put(`${environment.LOGIN_API}/v1/user/change/`, {
        role: roleId,
        user: user,
        viewingDate: typeof viewingDate === 'object' ? JSON.stringify(viewingDate) : viewingDate,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success)
            changeRole(true, response.result.role, response.result.permissions);
          changeRole(false, [], []);
        },
        (error) => {
          changeRole(false, [], []);
          this.toastr.error("Hubo un problema al Cambiar de Rol");
        }
      );
  }

  acceptAvisoPrivacidad(user: string, isSuccess: (success: boolean) => void) {
    const handleResponse = ResponseFunctions.handleCreateResponse(
      this.toastr,
      isSuccess,
      "Aceptar Aviso de Privacidad"
    );
    this.httpClient
      .put(`${environment.LOGIN_API}/v1/user/avisoPrivacidad`, { user })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }
}
