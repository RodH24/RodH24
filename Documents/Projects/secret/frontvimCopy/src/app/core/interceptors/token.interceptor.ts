import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { TokenEntity, SessionEntity } from "@app/data/entities";
import { Router } from "@angular/router";
import { DateFunctions, RedirectionFunctions } from "@data/functions";
import { ToastrService } from "ngx-toastr";
import { environment } from "@env/environment";
import * as moment from "moment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> | any {
    const token = new TokenEntity(this.cookieService);

    let cleanRequest = this.isNonLoggedRoutes(request);
    if (cleanRequest) {
      return next.handle(cleanRequest);
    }

    /** Handle de request que no necesitan authentication token standar */
    cleanRequest = this.isNoTokenRequest(request);
    if (cleanRequest) {
      return next.handle(cleanRequest);
    }

    cleanRequest = this.isTokenRequest(token, request);
    if (cleanRequest) {
      return next.handle(cleanRequest);
    }
    this.logOut(token);
  }

  private isNonLoggedRoutes(
    request: HttpRequest<any>
  ): HttpRequest<any> | null {
    const skipIntercept = request.headers.has("nonLogged");
    if (skipIntercept) {
      request = request.clone({
        headers: request.headers.delete("nonLogged"),
      });
      return request;
    }
    return null;
  }

  private isNoTokenRequest(request: HttpRequest<any>): HttpRequest<any> | null {
    const skipIntercept = request.headers.has("noToken");
    if (skipIntercept) {
      request = request.clone({
        headers: request.headers.delete("noToken"),
      });
      return request;
    }
    return null;
  }

  private isTokenRequest(
    token: TokenEntity,
    request: HttpRequest<any>
  ): HttpRequest<any> | null {
    const sessionEntity = new SessionEntity();
    if (token.value && token.isValid) {
      request = request.clone({
        headers: request.headers
          .set(
            "Authorization",
            `Bearer ${token.value} ${environment.GEG_IMPULSO_AUTH_TOKEN_API_KEY}`
          )
          .set("SessionRole", JSON.stringify(sessionEntity.activeRol)),
      });

      let vigencia = this.getVigenciaObj(sessionEntity);
      if (
        request.method.toLowerCase() === "post" ||
        request.method.toLowerCase() === "put"
      ) {
        if (request.body instanceof FormData) {
          request = request.clone({
            body: request.body.append("vigencia", vigencia),
          });
        } else {
          let vigenciaPost = { vigencia: vigencia };
          request = request.clone({
            body: { ...request.body, ...vigenciaPost },
          });
        }
      }
      if (request.method.toLowerCase() === "get") {
        request = request.clone({
          params: request.params.set("vigencia", vigencia),
        });
      }
      return request;
    }

    token.logOut();
    sessionEntity.logOut();
    RedirectionFunctions.redirectToLogin(this.router);
    return null;
  }

  private logOut(token: TokenEntity): void {
    this.toastr.info(
      "Por cuestiones de seguridad su sesión ha terminado. Es necesario que vuelva a ingresar.",
      "Cierre de Sesión",
      {
        timeOut: 5000,
        positionClass: "toast-top-full-width",
      }
    );
    token.logOut();
    RedirectionFunctions.redirectToLogin(this.router);
  }

  private getVigenciaObj(sessionEntity: SessionEntity): string {
    const vigenciaObjContent =
      sessionEntity.getViewingDate != null
        ? DateFunctions.getCleanDateRange(sessionEntity.viewingYear.toString())
        : null;

    return JSON.stringify(vigenciaObjContent);
  }
}
