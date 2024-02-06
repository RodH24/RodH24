import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity,SessionEntity } from '@data/entities';
import { RedirectionFunctions } from '@data/functions';

/**
 * Control the accessibility for non logged users
 * @Guard
 */
@Injectable()
export class NoAuthGuard implements CanActivate {
  /**
   * @constructor
   * @param {CookieService} cookieService - Service to handle cookies.
   * @param {Router} router - Angular route service.
   */
  constructor(private cookieService: CookieService, private router: Router) {}

  /**
   * Defines if the user can access or not based in the auth token
   * @return {boolean} canAccess
   */
  canActivate(): boolean {
    const token: TokenEntity = new TokenEntity(this.cookieService);
    const session: SessionEntity = new SessionEntity();    
    if (token.value && Object.keys(session.activeRol).length) {
      RedirectionFunctions.redirectToMainPage(this.router, session.activeRol);
      return true;
    }
    return true;
  }
}
