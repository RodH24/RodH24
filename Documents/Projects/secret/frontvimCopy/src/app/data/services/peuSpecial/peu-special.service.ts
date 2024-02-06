import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApplicationStorageEntity, TokenEntity } from '@app/data/entities';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Cookies } from '@app/data/constants/cookies';
import { SolicitudFunctions } from '@app/data/functions';


@Injectable({
  providedIn: 'root',
})
export class PeuSpecialService {
  private entity_peu_special: string = 'specialPeu';

  constructor(private http: HttpClient, private cookieService: CookieService, private toastr: ToastrService) {
  }

  public getCountDataBySupportType(tipeFIlterValue: string, selectedQ: string, responseCallback: (response: any) => void): void {
    
    this.http.get(`${environment.SOLICITUD_API}/v1/${this.entity_peu_special}/getCountDataBySupportType/${selectedQ}/${tipeFIlterValue}`)
      .pipe(first()).subscribe((response: any) => {
        if (response.success) {
          responseCallback({
            result: response.result
          });
        }
      },
        (error: any) => {
          responseCallback({
            total_women: 0,
            total_men: 0,
          });
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }

  public getCountDataByMunicipality(municipality: string, selectedQ: string, responseCallback: (response: any) => void): void {

    this.http.get(`${environment.SOLICITUD_API}/v1/${this.entity_peu_special}/getCountDataByMunicipality/${selectedQ}/${municipality}`)
      .pipe(first()).subscribe((success_response: any) => {
        if (success_response.success) {
          responseCallback({
            result: success_response.result
          });
        }
      },
        (error: any) => {
          responseCallback({
            result: []
          });
          this.toastr.error('Hubo un problema al contar los municipios afectados.');
        }
      );
  }

  public getCountDataByImpulseZone(selectedQ: any, responseCallback: (response: any) => void): void {

    this.http.get(`${environment.SOLICITUD_API}/v1/${this.entity_peu_special}/getCountDataByImpulseZone/${selectedQ}`)
      .pipe(first()).subscribe((success_response: any) => {
        if (success_response.success) {
          responseCallback({
            result: success_response.result
          });
        }
      },
        (error: any) => {
          responseCallback({
            result: []
          });
          this.toastr.error('Hubo un problema al contar los municipios afectados.');
        }
      );
  }
}
