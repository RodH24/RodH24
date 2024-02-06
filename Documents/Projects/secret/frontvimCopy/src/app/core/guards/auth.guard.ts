import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import { RedirectionFunctions } from '@data/functions';

/**
 * Control the accessibility for logged users
 * @Guard
 */
@Injectable()
export class AuthGuard implements CanLoad {
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
  canLoad(): boolean {
    const token: TokenEntity = new TokenEntity(this.cookieService);
    if (token.value) {
      return true;
    }
    RedirectionFunctions.redirectToLogin(this.router);
    return false;
  }
}
