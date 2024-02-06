import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ResponseFunctions } from '@app/data/functions';

@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  private ENTITY = 'oficina';
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public list(
    page: { pageSize: number; pageIndex: number } | null,
    isEnabled: boolean | null = true, // si se va a filtrar por las activas
    cp: string | null = null, // si se va a filtrar por cp
    keyword: string | null = null, // si se va a filtrar por palabra clave
    getList: (list: Array<any> | { list: Array<any>; total: number }) => void
  ) {
    const handleResponse = page
      ? ResponseFunctions.handlePaginatedListResponse(this.toastr, getList, 'List Ventanilla')
      : ResponseFunctions.handleListResponse(this.toastr, getList, 'List Ventanilla');

    let url = `${environment.UTILS_API}/v1/${this.ENTITY}/list`;
    url += page ? `?size=${page.pageSize}&index=${page.pageIndex}` : '';

    this.httpClient.put(url,
      {
        isEnabled,
        cp,
        keyword
      })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error)
  }









  

  public getOfficeList(
    getList: (list: Array<any>) => void,
    dependency: string = ''
  ) {
    this.httpClient
      .put(`${environment.UTILS_API}/v1/utils/office/list`, {
        ...(dependency === '' ? {} : { dependency }),
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getList(response.result);
            return;
          } else {
            this.toastr.error(
              'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
            );
            getList([]);
            return;
          }
        },
        (error: any) => {
          getList([]);
          this.toastr.error(
            'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
          );
          return;
        }
      );
  }

  public getOfficeListByDependency(
    pagination: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ) {
    const handleListResponse = this.handleListResponse(getList);

    this.httpClient
      .get(
        `${environment.UTILS_API}/v1/utils/office/dependency/list?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }

  public getOfficeByStatus(
    pagination: any,
    isEnabled: boolean,
    getList: (data: { list: Array<any>; total: number }) => void
  ) {
    const status = isEnabled ? 'enabled' : 'disabled';
    const handleListResponse = this.handleListResponse(getList);

    this.httpClient
      .get(
        `${environment.UTILS_API}/v1/utils/office/dependency/list/${status}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }

  public getOfficeByCp(
    pagination: any,
    cp: string,
    getList: (data: { list: Array<any>; total: number }) => void
  ) {
    const handleListResponse = this.handleListResponse(getList);

    this.httpClient
      .put(
        `${environment.UTILS_API}/v1/${this.ENTITY}/list/${cp}?size=${pagination.pageSize}&index=${pagination.pageIndex}`,
        {
          cp
        }
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }

  public getOfficeListByWord(
    pagination: any,
    word: string,
    getList: (data: { list: Array<any>; total: number }) => void
  ) {
    const handleListResponse = this.handleListResponse(getList);

    this.httpClient
      .get(
        `${environment.UTILS_API}/v1/utils/office/list/filtered/${word}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(handleListResponse.success, handleListResponse.error);
  }

  public createOffice(
    newData: {
      descripcion: string;
      domicilio: {
        cp: string;
        entidadFederativa: string;
        nombreMunicipio: string;
        colonia: string;
        calle: string;
        numeroExt: string;
        numeroInt: string;
      };
      contacto: { telefono: string };
      clave: string;
    },
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = this.handleUpdateResponse(isSuccess);

    this.httpClient
      .post(`${environment.UTILS_API}/v1/utils/office`, { newData })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public updateOffice(
    id: string,
    codigo: string,
    newData: {
      descripcion: string;
      domicilio: {
        cp: string;
        entidadFederativa: string;
        nombreMunicipio: string;
        colonia: string;
        calle: string;
        numeroExt: string;
        numeroInt: string;
      };
      contacto: { telefono: string };
    },
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = this.handleUpdateResponse(isSuccess);

    this.httpClient
      .put(`${environment.UTILS_API}/v1/utils/office`, {
        idOffice: id,
        newData: { ...newData, codigo },
      })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }


  

  /**************************************
   ************ Responses ***************
   **************************************/
  private handleListResponse(
    getList: (data: { list: Array<any>; total: number }) => void
  ): {
    success: ((value: Object) => void) | undefined;
    error: ((error: any) => void) | undefined;
  } {
    return {
      success: (response: any) => {
        if (response.success) {
          getList({
            list: response.result.list,
            total: response.result.total,
          });
          return;
        } else {
          this.toastr.error(
            'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
          );
          getList({
            list: [],
            total: 0,
          });
          return;
        }
      },
      error: (error: any) => {
        getList({
          list: [],
          total: 0,
        });
        this.toastr.error(
          'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
        );
        return;
      },
    };
  }

  private handleUpdateResponse(isSuccess: (isSuccess: boolean) => void): {
    success: ((value: Object) => void) | undefined;
    error: ((error: any) => void) | undefined;
  } {
    return {
      success: (response: any) => {
        if (response.success) {
          this.toastr.success('La oficina se ha actualizado correctamente');
          isSuccess(true);
          return;
        }
        if (response?.result?.ventanillaExists) {
          this.toastr.error('No fue posible registrar la oficina, la clave de ventanilla ya existe');
          isSuccess(false);
          return;
        }
        this.toastr.error(
          'Ocurrió un error al actualizar la oficina. Por favor inténtelo de nuevo más tarde.'
        );
        isSuccess(false);
        return;
      },
      error: (error: any) => {
        this.toastr.error(
          'Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde.'
        );
        isSuccess(false);
        return;
      },
    };
  }
}
