import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  private headers: any;

  constructor(private httpClient: HttpClient, private toastr: ToastrService, public injector:Injector) {
    this.headers = new HttpHeaders()
      .set(
        'Authorization',
        `Bearer ${environment.GEG_IMPULSO_AUTH_TOKEN_API_KEY}`
      )
      .set('nonLogged', 'true');
  }

  getSideBarStructure(sidebarStructure: (data: Array<any>) => void): void {
    this.httpClient.get(
      `${environment.LOGIN_API}/v1/user/sidebar`,
      { headers: this.headers })
      .pipe(first()).subscribe((response: any) => {
        sidebarStructure(response.result);    
      },
      (error) => {
        sidebarStructure([]);    
        this.toastr.error('Hubo un problema al obtener la estrucura del sidebar');
      }
    );
  }

}
