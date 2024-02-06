import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CurpType, User } from '@app/data/types';
import { Roles } from '@app/data/constants/auth';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  public getCurpData(
    curp: string,
    getData: (curpData: CurpType | null) => void
  ): void {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.CURP_TEST_TOKEN}`)
      .set('noToken', 'true');

    this.httpClient
      .post(
        `${environment.CURP_API}/v1/citizen/getCurp`,
        { curp, appClientId: environment.CURP_CLIENT_ID },
        { headers }
      )
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            const data = {
              curp: response.result.curp,
              entidadNacimiento: response.result.entidadNacimiento,
              fechaNacimientoDate: response.result.fechaNacimientoDate,
              fechaNacimientoTexto: response.result.fechaNacimientoTexto,
              genero: response.result.genero,
              nacionalidad: response.result.nacionalidad,
              nombre: response.result.nombre,
              primerApellido: response.result.primerApellido,
              segundoApellido: response.result.segundoApellido,
              anioRegistro: response.result.registro.anioRegistro,
            };
            getData(data);
          } else {
            this.toastr.warning(
              'No se encontró información de la CURP ingresada.'
            );
            getData(null);
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al procesar su solicitud.');
          getData(null);
        }
      );
  }

  public getCpData(
    cp: string,
    getData: (
      data: {
        neighborhoodList: any;
        state: any;
        municipality: any;
      } | null
    ) => void
  ): void {
    const headers = new HttpHeaders().set('noToken', 'true');
    // https://igto.guanajuato.gob.mx/api/sepomex?cp=37299
    this.httpClient
      .get(`${environment.SOLICITUD_API}/v1/application/sepomex/${cp}`, {
        headers,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          const neighborhoodResponse = response.result;
          if (response.success && neighborhoodResponse.length > 0) {
            const state = neighborhoodResponse[0].d_estado;
            const municipality = neighborhoodResponse[0].D_mnpio;
            const neighborhoodList = neighborhoodResponse.map(
              (element: any) => `${element.d_tipo_asenta} ${element.d_asenta}`
            );
            return getData({ neighborhoodList, state, municipality });
          } else {
            this.toastr.warning('No se encontró información de este CP.');
            getData(null);
            return;
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al procesar su solicitud.');
          getData(null);
          return;
        }
      );
  }

  public getSolicitudCpData(cp: string, getData: (data: { neighborhoodList: any; state: any; municipality: any; } | null) => void): void {
    const headers = new HttpHeaders().set('noToken', 'true');
    this.httpClient
      .get(`${environment.SOLICITUD_API}/v1/application/sepomex/${cp}`, {
        headers,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          const neighborhoodResponse = response.result;
          if (response.success && neighborhoodResponse.length > 0) {
            const state = neighborhoodResponse[0].d_estado;
            const municipality = neighborhoodResponse[0].D_mnpio;
            const neighborhoodList = neighborhoodResponse.map(
              (element: any) => ({ nombre: element.d_asenta.toUpperCase(), tipo: element.d_tipo_asenta.toUpperCase() })
            );
            return getData({ neighborhoodList, state, municipality });
          } else {
            this.toastr.warning('No se encontró información de este CP.');
            getData(null);
            return;
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al procesar su solicitud.');
          getData(null);
          return;
        }
      );
  }

  public getAddressFromCoords(latitude:number, longitude:number, getData: (data: string | null) => void): void {
    this.httpClient.get(`${environment.SOLICITUD_API}/v1/application/getAddressFromCoords/${latitude}/${longitude}`).pipe(first())
      .subscribe(
        (response: any) => {
            return getData(response.result);
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al obtener la direccion con las coordenadas.');
          getData(null);
          return;
        }
      );
  }

  public getCPvalidationData(bodyStringify: any, getData: (data: { value: boolean, data: any } | null) => void): void {
    this.httpClient.post(`${environment.SOLICITUD_API}/v1/application/addressValidation/`, bodyStringify).pipe(first()).subscribe((response: any) => {
      function onlyUniqueValues(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
      }

      var cpArray = Object.values(response.result.zipCodes).filter(onlyUniqueValues);

      if (cpArray.length == 1) {
        // Correct cp (same value)
        getData({
          value: true,
          data: response.result
        })
      } else {
        // Distinct value 
        getData({
          value: false,
          data: response.result
        })
      }
    },
      (error: any) => {
        this.toastr.error('Hubo un problema al procesar su solicitud.');
        getData(null);
        return;
      }
    );
  }

  public isValidImpulso(folio: string, getData: (curpData: any) => void) {
    const headers = new HttpHeaders().set('noToken', 'true');
    this.httpClient
      .get(`${environment.CURP_API}/v1/citizen/tarjetaImpulso/${folio}`, {
        headers,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getData(response.result);
            return;
          } else {
            this.toastr.warning(
              'Lo sentimos, no se encontró el folio ingresado.'
            );
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al procesar su solicitud.');
          getData(null);
          return;
        }
      );
  }

  /**************************************
    *********** Dependency ***************
    **************************************/

  public getDependencyList(getList: (list: Array<any>) => void) {
    this.httpClient
      .get(`${environment.UTILS_API}/v1/utils/dependency/list`)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getList(response.result.list);
          } else {
            this.toastr.warning(
              'No se encontró información de las dependencias.'
            );
            getList([]);
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al obtener la lista de dependencias.');
          getList([]);
        }
      );
  }

  public getOpenDependencyList(getList: (list: Array<any>) => void) {
    const headers = new HttpHeaders().set('nonLogged', 'true');
    this.httpClient
      .get(`${environment.UTILS_API}/v1/utils/open/dependency/list`, {
        headers: headers,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getList(response.result.list);
          } else {
            this.toastr.warning(
              'No se encontró información de las dependencias.'
            );
            getList([]);
          }
        },
        (error: any) => {
          this.toastr.error('Hubo un problema al obtener las dependencias abiertas');
          getList([]);
        }
      );
  }

  /**************************************
   ************** Roles *****************
   **************************************/

  public getRoles(getList: (data: Array<User>) => void): void {
    this.httpClient
      .get(`${environment.UTILS_API}/v1/utils/role/list`)
      .pipe(first())
      .subscribe(
        (response) => {
          const res = response as any;
          if (res.success) {
            getList(
              /** Append to the elements the value of showName to fill the select with the formatted name */
              res.result.list.map((element: { _id: string; name: string }) => {
                return {
                  ...element,
                  showName: this.getRoleShowName(element.name),
                };
              })
            );
          } else {
            getList([]);
            this.toastr.error('Hubo un problema al procesar su solicitud.');
          }
        },
        (error) => {
          getList([]);
          this.toastr.error('Hubo un problema al procesar su solicitud.');
        }
      );
  }

  private getRoleShowName(dbName: string) {
    const key: any = Object.keys(Roles).find(
      (key) => Roles[key].dbName === dbName
    );
    return Roles[key].showName;
  }
}

