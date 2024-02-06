import { CookieService } from 'ngx-cookie-service';
import { Cookies } from '@data/constants/cookies';

export class BiggerModeEntity {
  private isBiggerMode: boolean = false;
  private cookieService: CookieService;

  constructor(cookieService: CookieService) {
    this.cookieService = cookieService;
  }

  public get isActive(): boolean {
    return this.cookieService.get(Cookies.BIGGER_MODE_COOKIE_NAME) === 'true';
  }

  public set isActive(value: boolean) {
    this.cookieService.set(Cookies.BIGGER_MODE_COOKIE_NAME, value.toString());
  }

  public delete(): boolean {
    this.cookieService.deleteAll();
    return true;
  }
};
