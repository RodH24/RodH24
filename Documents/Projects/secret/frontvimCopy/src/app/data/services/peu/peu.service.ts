import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@app/data/entities';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PeuService {
  private entity_peu: string = 'peu';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  public getSupportList(selectedQ: string, pagination: any, getList: (data: { list: Array<any>; total: number }) => void): void {
    this.http.get(`${environment.SOLICITUD_API}/v1/${this.entity_peu}/list/${pagination.pageSize}/${pagination.pageIndex}/${selectedQ}`)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getList({
              list: response.result.list,
              total: response.result.total,
            });
          } else {
            getList({
              list: [],
              total: 0,
            });
            this.toastr.error('Hubo un problema al paginar las modalidades.');
          }
        },
        (error: any) => {
          getList({
            list: [],
            total: 0,
          });
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }
  public getDetailListByDatesAndModalities(
    modality: string,
    initial_date: any,
    last_date: any,
    responseCallback: (data: any) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.entity_peu}/getDetailListByDatesAndModalities/${modality}/${initial_date}/${last_date}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback(response.result);
          } else {
            responseCallback({});
            this.toastr.error('Hubo un problema al paginar las modalidades.');
          }
        },
        (error: any) => {
          responseCallback({});
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }
  public getMiniKpiIndicators(
    modality: any,
    responseCallback: (response: any) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.entity_peu}/getMiniKpiIndicators/${modality}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback({
              total_women: response.result[0]['grandTotalMujeres'],
              total_men: response.result[0]['grandTotalHombres'],
            });
          } else {
            responseCallback({
              total_women: response.result[0]?.grandTotalMujeres || 0,
              total_men: response.result[0]?.grandTotalHombres || 0,
            });
            this.toastr.error('Hubo un problema al paginar las modalidades.');
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
  public getMunicipalitiesByModality(
    modality: any,
    responseCallback: (response: any) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.entity_peu}/getMunicipalitiesByModality/${modality}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback({
              count: response.result.length,
              data: response.result,
            });
          } else {
            responseCallback({
              count: response.result.length,
              data: response.result,
            });
            this.toastr.error('Hubo un problema al paginar las modalidades.');
          }
        },
        (error: any) => {
          responseCallback({
            count: 0,
            data: [],
          });
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }
  public getDetailSupportType(
    supportType: string,
    responseCallback: (data: any) => void
  ): void {
    this.http
      .get(
        `${environment.SOLICITUD_API}/v1/${this.entity_peu}/getDetailModality/${supportType}`
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback(response.result);
          } else {
            responseCallback({});
            this.toastr.error('Hubo un problema al paginar las modalidades.');
          }
        },
        (error: any) => {
          responseCallback({});
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }
  public addDetailPeu(
    body: any,
    responseCallback: (response: boolean) => void
  ): void {
    this.http
      .post(
        `${environment.SOLICITUD_API}/v1/${this.entity_peu}/addDetailPeu`,
        { body }
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            responseCallback(true);
          } else {
            responseCallback(false);
            this.toastr.error('Hubo un problema al paginar las modalidades.');
          }
        },
        (error: any) => {
          responseCallback(false);
          this.toastr.error('Hubo un problema al paginar las modalidades.');
        }
      );
  }
  

}