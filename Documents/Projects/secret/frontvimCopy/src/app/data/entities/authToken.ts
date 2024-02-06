import { CookieService } from "ngx-cookie-service";
import { Cookies } from "@data/constants/cookies";
import decode from "jwt-decode";
import { roleType, DateType } from "../types";
import * as moment from "moment";
import { DateFunctions } from "../functions";

export class TokenEntity {
  private token: string = "";
  private userRoles: string = "";
  private cookieService: CookieService;

  constructor(cookieService: CookieService) {
    this.cookieService = cookieService;
    this.updateToken();
    this.updateRoles();
  }

  /********************************************
   ************* G E T T E R S ****************
   ********************************************
   */

  get value(): string {
    return this.token;
  }

  get decodedValue(): string {
    return decode(this.token);
  }

  get hasPeu(): boolean {
    return this.getHasPeu();
  }

  get username(): string {
    return this.getUsername();
  }

  get email(): string {
    return this.getEmail();
  }

  get photo(): string {
    return this.getPhoto();
  }

  get isValid(): boolean {
    const expiry = this.getExpiration();
    return expiry === -1
      ? false
      : expiry >= Math.floor(new Date().getTime() / 1000);
  }

  get dependencyAcronym(): string {
    return this.getDependencyAcronym();
  }

  get dependencyId(): string {
    return this.getDependencyId();
  }

  get dependencyName(): string {
    return this.getDependencyName();
  }

  get programaId(): string {
    return this.getProgramaId();
  }

  get programName(): string {
    return this.getProgramName();
  }

  get roles(): Array<any> {
    return this.getRoles();
  }

  get userId(): string {
    return this.getUserId();
  }

  get tokenViewingDate(): string | null {
    return this.getTokenViewingDate();
  }
  /********************************************
   ************* S E T T E R S ****************
   ********************************************
   */

  set value(token: string) {
    this.cookieService.set(Cookies.AUTH_NAME, token);
    this.updateToken();
  }

  set rolesValue(userRolesCoded: string) {
    this.cookieService.set(Cookies.ROLES_NAME, userRolesCoded);
    this.updateRoles();
  }

  /************************************************
   ************* F U N C T I O N S ****************
   ************************************************
   */
  public rolesVigentes(viewingDate: DateType): Array<any> {
    return this.getRolesVigentes(this.getRoles(), viewingDate);
  }

  public getHasPeu(): boolean {
    const token = this.decodeToken();
    let hasPeu: boolean = false;

    for (let rol of token.roles) {
      if (rol.hasPeu) {
        hasPeu = true;
      }
    }
    return hasPeu;
  }

  public itsMe(inputEmail: string): boolean {
    return this.getEmail() === inputEmail;
  }
  private getEmail(): string {
    const token = this.decodeToken();
    return token ? token.email : null;
  }

  public logOut(): void {
    this.delete();
    sessionStorage.clear();
  }

  private delete(): boolean {
    this.cookieService.delete(Cookies.AUTH_NAME);
    this.cookieService.deleteAll();
    this.cookieService.deleteAll("/");
    return true;
  }

  private decodeToken(): any {
    this.updateToken();
    if (this.token) {
      return decode(this.token);
    }
    return null;
  }

  private decodeRoles(): any {
    this.updateRoles();
    if (this.userRoles) {
      return decode(this.userRoles);
    }
    return null;
  }

  public getDependencyAcronym(): string {
    const token = this.decodeToken();
    return token.dependency?.acronym;
  }

  public getDependencyId(): string {
    const token = this.decodeToken();
    return token.dependency?.id;
  }

  public getDependencyName(): string {
    const token = this.decodeToken();
    return token.dependency?.name;
  }

  private getExpiration(): number {
    const token = this.decodeToken();
    return token ? parseInt(token.exp) : -1;
  }

  private updateToken() {
    this.token = this.cookieService.get(Cookies.AUTH_NAME);
  }

  private updateRoles() {
    this.userRoles = this.cookieService.get(Cookies.ROLES_NAME);
  }

  private getUsername(): string {
    const token = this.decodeToken();
    return token ? token.name : null;
  }

  private getPhoto(): string {
    const token = this.decodeToken();
    return token ? token.urlImage : null;
  }

  private getProgramaId(): string {
    const token = this.decodeToken();
    return token ? token.program?.id : null;
  }

  private getProgramName(): string {
    const token = this.decodeToken();
    return token ? token.program?.name : null;
  }

  private getRoles(): Array<any> {
    const userRoles = this.decodeRoles();
    return userRoles ? userRoles.roles : [];
  }

  private getRolesVigentes(
    roles: Array<any>,
    viewingDate: DateType
  ): Array<any> {
    let rolesVigentes = roles.filter((role: any) =>
      DateFunctions.isInRange(viewingDate, role?.vigencia)
    );
    return rolesVigentes ? rolesVigentes : [];
  }

  private getUserId(): string {
    const token = this.decodeToken();
    return token ? token.uid : "";
  }

  private getTokenViewingDate(): string {
    const token = this.decodeToken();
    return token?.viewingDate ? token.viewingDate : null;
  }

  public findRolObject(activeRole: roleType): roleType {
    let role: roleType = <roleType>{};
    if (this.token) {
      const userRoles = this.getRoles(); //For real Token flow
      role =
        userRoles.filter(
          (value: any) =>
            value.id == activeRole.id || value.key == activeRole.key
        )[0] || <roleType>{};
    }
    return role ? role : <roleType>{};
  }

  public getRolNameFromResponse(activeRole: roleType): string {
    let objectRole = this.findRolObject(activeRole);
    let rolename = objectRole.key;
    return rolename;
  }
}
