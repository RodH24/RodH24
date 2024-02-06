import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  public getMunicipioList(
    estado: string | null,
    getList: (list: any) => void
  ): void {
    const headers = new HttpHeaders()
      .set('noToken', 'true');

    this.httpClient
      .put(
        `${environment.UTILS_API}/v1/catalogos/municipio/list`,
        { estado },
        { headers }
      )
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            getList(response.result.list);
          } else {
            this.toastr.warning(
              'No se pudo obtener la información de los municipios'
            );
            getList([]);
          }
        },
        error: (error: any) => {
          this.toastr.error('Hubo un problema al procesar su solicitud.');
          getList([]);
        }
    });
  }
}

