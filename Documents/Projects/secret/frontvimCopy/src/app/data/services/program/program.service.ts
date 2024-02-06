import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { environment } from "@env/environment";
import { PaginationType, ProgramType } from "@app/data/types";
import { ResponseFunctions } from "@app/data/functions";

@Injectable({
  providedIn: "root",
})
export class ProgramService {
  private readonly entity = "program";

  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public get(
    programId: string | null,
    programClave: string | null,
    modalidadClave: string | null,
    apoyoClave: string | null,
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null,
    getData: (data: ProgramType | null) => void
  ): void {
    let url = `${environment.PROGRAM_API}/v1/${this.entity}/read`;

    const body = {
      programId,
      programClave,
      modalidadClave,
      apoyoClave,
      vigencia,
    };

    this.httpClient
      .put(url, body)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success && response.result.data) {
            getData(response.result.data);
          } else {
            this.toastr.error("No se pudo recuperar la información.");
            getData(null);
          }
        },
        (error: any) => {
          getData(null);
          this.toastr.error("Hubo un problema al procesar su solicitud.");
        }
      );
  }

  public create(
    program: ProgramType,
    getData: (id: null | string) => void
  ): void {
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/create`, { program })
      .pipe(first())
      .subscribe({
        next: (result: any) => {
          if (result.success) {
            return getData(result.result.insertedId);
          }
          ResponseFunctions.requestErrorToast(this.toastr, result.statusText);
          return getData(null);
        },
        error: (error: any) => {
          ResponseFunctions.requestErrorToast(this.toastr, error);
          return getData(null);
        },
      });
  }

  public delete(
    programId: string,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(
      this.toastr,
      getSuccess
    );

    this.httpClient
      .put(`${environment.PROGRAM_API}/v1/${this.entity}/update/status`, {
        programId,
      })
      .pipe(first())
      .subscribe({
        next: handleFunction.success,
        error: handleFunction.error,
      });
  }

  public list(
    page: { pageSize: number; pageIndex: number } | null, // paginador, si es null se regresa la lisrta completa
    isEnabled: boolean | null, // si el programa esta habilitado o no, si es null solo regresa habilitados
    isPeu: boolean | null, // si es filtro por peu, si es null solo regresa todos
    word: string | null, // filtor por palabra, si es null no hace mningun filtro
    isFilter: boolean, // si va a estar filtrado por las caracteristicas del activerole, si es falso regresa no filtrada por el rol
    type: string | null, //'claveQ' | 'modalidad' | 'tipoApoyo',
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null,
    getList: (data: { list: Array<any>; total: number } | Array<any>) => void
  ) {
    let handlePaginatedListResponse: any = {};
    if (page)
      handlePaginatedListResponse =
        ResponseFunctions.handlePaginatedListResponse(
          this.toastr,
          getList,
          "Program List"
        );
    else
      handlePaginatedListResponse = ResponseFunctions.handleListResponse(
        this.toastr,
        getList,
        "Program List"
      );

    let url = `${environment.PROGRAM_API}/v1/${this.entity}/list?`;
    url += page ? `size=${page.pageSize}&index=${page.pageIndex}&` : "";
    url += type ? `type=${type}` : "";

    this.httpClient
      .put(url, {
        isEnabled,
        isPeu,
        word,
        isFilter,
        vigencia,
      })
      .pipe(first())
      .subscribe(
        handlePaginatedListResponse.success,
        handlePaginatedListResponse.error
      );
  }

  public update(
    program: ProgramType,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(
      this.toastr,
      getSuccess
    );
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/update`, { program })
      .pipe(first())
      .subscribe({
        next: handleFunction.success,
        error: handleFunction.error,
      });
  }

  // LISTAR TODOS LOS PROGRAMAS ACTIVOS
  public listComplete(
    pagination: any | null,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    let query = "";

    if (pagination) {
      query = `?size=${pagination.pageSize}&index=${pagination.pageIndex}`;
    }

    this.httpClient
      .get(`${environment.PROGRAM_API}/v1/${this.entity}/list${query}`)
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // lISTAR POR DEPENDENCIA (ACTIVOS E INACTIVOS)
  public listFromPanel(
    pagination: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/dependency?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // LISTAR POR DEPENDENCIA ACTIVOS
  public listFromPanelEnabled(
    pagination: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/dependency/enabled?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // LISTAR POR DEPENDENCIA INACTIVOS
  public listFromPanelDisabled(
    pagination: any,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/dependency/disabled?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // LISTAS POR ETIQUETA Y DEPENDENCIA (ACTIVOS E INACTIVOS)
  public listByWordComplete(
    pagination: any,
    word: string,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/search/${word}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // LISTAR POR ETIQUETA Y DEPENDENCIA (ACTIVOS)
  public listByWordEnabled(
    pagination: any,
    word: string,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/enabled/search/${word}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  // LISTAR POR ETIQUETA Y DEPENDENCIA (INACTIVOS)
  public listByWordDisabled(
    pagination: any,
    word: string,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    this.httpClient
      .get(
        `${environment.PROGRAM_API}/v1/${this.entity}/list/disabled/search/${word}?size=${pagination.pageSize}&index=${pagination.pageIndex}`
      )
      .pipe(first())
      .subscribe(
        this.handleGetResponse(getList).success,
        this.handleGetResponse(getList).error
      );
  }

  public updateStatus(
    programId: string,
    isEnabled: boolean,
    getResponse: (isSuccess: boolean) => void
  ): void {
    this.httpClient
      .put(`${environment.PROGRAM_API}/v1/${this.entity}/update/status`, {
        isEnabled,
        programId,
      })
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.success) {
            getResponse(true);
            this.toastr.success("El programa se actualizó correctamente.");
          } else {
            getResponse(false);
            this.toastr.error("Hubo un problema al procesar su solicitud.");
          }
        },
        (error: any) => {
          getResponse(false);
          this.toastr.error("Hubo un problema al procesar su solicitud.");
        }
      );
  }

  public updateTags(
    programId: string,
    modalidadClave: string,
    tags: Array<string>,
    vigencia:
      | { startDate: string | null; endDate: string | null }
      | string
      | null,
    getResponse: (isSuccess: boolean) => void
  ): void {
    this.httpClient
      .put(`${environment.PROGRAM_API}/v1/${this.entity}/update/tags`, {
        vigencia,
        programId,
        modalidadClave,
        tags,
      })
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            getResponse(true);
            this.toastr.success("El programa se actualizó correctamente.");
          } else {
            getResponse(false);
            this.toastr.error("Hubo un problema al procesar su solicitud.");
          }
        },
        error: (error: any) => {
          getResponse(false);
          this.toastr.error("Hubo un problema al procesar su solicitud.");
        },
      });
  }

  private handleGetResponse(
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
            total: response.result.total ?? -1,
          });
          return;
        } else {
          this.toastr.error(
            "Hubo un problema al procesar los programas. Por favor inténtelo de nuevo más tarde."
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
          "Hubo un problema al procesar los programas. Por favor inténtelo de nuevo más tarde."
        );
        return;
      },
    };
  }
}
