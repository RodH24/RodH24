import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { environment } from "@envenvironment";
import { ResponseFunctions } from "@app/data/functions";

@Injectable({
  providedIn: 'root',
})
export class VentanillaService {
  private readonly ENTITY = 'ventanilla';

  constructor(private httpClient: HttpClient, private toast: ToastrService) {}

  public create(
    officeId: string,
    newData: {
      clave: string;
      telefono: string;
    },
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = ResponseFunctions.handleCreateResponse(this.toast, isSuccess, 'Crear ventanilla');
    this.httpClient
      .post(`${environment.UTILS_API}/v1/${this.ENTITY}/create`, {
        officeId: officeId,
        newData,
      })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public delete(
    ventanilla: {
      clave: string,
      dependencia: string,
    },
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = ResponseFunctions.handleCreateResponse(this.toast, isSuccess, 'Eliminar ventanilla');
    this.httpClient
      .put(`${environment.UTILS_API}/v1/${this.ENTITY}/delete`, { ventanilla })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public list(
    page: { pageSize: number; pageIndex: number } | null,
    isFilterByUser: boolean = true, // si se va a filtrar por session de usuario
    dependencyId: string | null = null, // si se va a filtrar por una dependencia
    isEnabled: boolean | null = true, // si se va a filtrar por las activas
    cp: string | null = null, // si se va a filtrar por cp
    keyword: string | null = null, // si se va a filtrar por palabra clave
    getList: (list: Array<any> | { list: Array<any>; total: number }) => void
  ): void {
    const handleResponse = page
      ? ResponseFunctions.handlePaginatedListResponse(this.toast, getList, 'List Ventanilla')
      : ResponseFunctions.handleListResponse(this.toast, getList, 'List Ventanilla');

    let url = `${environment.UTILS_API}/v1/${this.ENTITY}/list`;
    url += page ? `?size=${page.pageSize}&index=${page.pageIndex}` : '';

    this.httpClient.put(url,
      {
        dependency: dependencyId,
        isFilter: isFilterByUser,
        isEnabled,
        cp,
        keyword
      })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error)
  }
}
