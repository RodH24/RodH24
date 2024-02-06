import { Injectable } from '@angular/core';
import { CanLoad, CanActivateChild, Route, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import { SessionEntity } from '@data/entities';
import { RedirectionFunctions } from '@data/functions';
import { roleType } from '@app/data/types';

/**
 * Control the accessibility for Enlace Role
 * The name is in spanish for a better communication with real roles
 * @Guard
 */
@Injectable()
export class UniversalGuard implements CanActivateChild, CanLoad {
  /**
   * @constructor
   * @param {CookieService} cookieService - Service to handle cookies.
   * @param {Router} router - Angular route service.
   */

  constructor(private cookieService: CookieService, private router: Router) { }

  /**
   * Defines if the user can access or not based in the auth token
   * @return {boolean} canAccess
   */
  canLoad(route: Route): boolean {
    let path = route.path;
    let canAccess: boolean = false;
    const token: TokenEntity = new TokenEntity(this.cookieService);
    const session: SessionEntity = new SessionEntity();
    let permissionObjList = session.permissionsObjList;
    //If is not logued in, Redirect to Login
    if(!token.isValid){
      token.logOut();
      session.logOut();
      RedirectionFunctions.redirectToLogin(this.router);
    }
    //If doesn't have main Route Redirect to Login
    if (!session.activeRol.mainRoute) {
      token.logOut();
      session.logOut();
      RedirectionFunctions.redirectToLogin(this.router);
    }
    //If is trying to go to the main page let in even if doesnt have in permissions
    if (session.activeRol.mainRoute.split("/", 1)[0] == path)
      return true;

    //If doesnt have permissions with route redirect to login
    //Previos condition make this work only if de path is not the same as mainRoute
    if (!permissionObjList.some((p: any) => p.attr ? p.attr.hasOwnProperty('route') : false)) {
      token.logOut();
      session.logOut();
      RedirectionFunctions.redirectToLogin(this.router);
    }

    //Check if has permission for access to current path and let in 
    //but redirect to Main page in case that doesnt have permission
    canAccess = permissionObjList.some((p: any) => p.attr ? p.attr.route?.split("/", 1) == path : false);
    if (!canAccess)
      RedirectionFunctions.redirectToMainPage(this.router, session.activeRol);

    return canAccess;
  }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let path = state.url.substring(1);
    let canAccess: boolean = false;
    const token: TokenEntity = new TokenEntity(this.cookieService);
    const session: SessionEntity = new SessionEntity();
    let permissionObjList = session.permissionsObjList;
    //If is not logued in, Redirect to Login
    if (!token.isValid) {
      token.logOut();
      session.logOut();
      RedirectionFunctions.redirectToLogin(this.router);
    }

    if (session.activeRol.mainRoute == path)
      return true;

    canAccess = permissionObjList.some((p: any) => p.attr ? p.attr.route == path : false);
    return canAccess;
  }
}
