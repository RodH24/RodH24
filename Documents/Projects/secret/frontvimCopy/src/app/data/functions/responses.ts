import { ToastrService } from 'ngx-toastr';

type ResponseType = {
  success: boolean,
  message: string,
  result?: { list: Array<any>, total?: number }
}

export function handlePaginatedListResponse(
  toastr: ToastrService,
  getList: (data: { list: Array<any>; total: number }) => void,
  functionName: string = ''
): {
  success: ((value: Object) => void) | undefined;
  error: ((error: any) => void) | undefined;
} {
  return {
    success: (response: any) => {
      if (response.success) {
        getList({
          list: response.result?.list ?? [],
          total: response.result?.total ?? 0,
        });
        return;
      } else {
        return returnEmptyPaginatedList(false, toastr, functionName, response.message, getList);
      }
    },
    error: (error: any) => {
      return returnEmptyPaginatedList(true, toastr, functionName, error, getList);
    },
  };
}

export function handleListResponse(
  toastr: ToastrService,
  getList: (data: Array<any>) => void,
  functionName: string = ''
): {
  success: ((value: Object) => void) | undefined;
  error: ((error: any) => void) | undefined;
} {
  return {
    success: (response: any) => {
      if (response.success) {
        getList(response.result.list);
        return;
      } else {
        return returnEmptyList(false, toastr, functionName, response.message, getList);
      }
    },
    error: (error: any) => {
      return returnEmptyList(true, toastr, functionName, error, getList);
    },
  };
}

export function handleSuccessResponse(
  toastr: ToastrService,
  isSuccess: (isSuccess: boolean) => void,
  functionName: string = ''
): {
  success: ((value: Object) => void) | undefined;
  error: ((error: any) => void) | undefined;
} {
  return {
    success: (response: any) => {
      if (response.success) {
        toastr.success(`La operación se ha completado exitosamente`, functionName);
        isSuccess(true);
        return;
      }
      toastr.error(
        'Ocurrió un error al realizar la operación. Por favor inténtelo de nuevo más tarde.',
        functionName
      );
      isSuccess(false);
      return;
    },
    error: (error: any) => {
      toastr.error(
        'Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde.',
        functionName
      );
      isSuccess(false);
      return;
    },
  };
}

export function handleCreateResponse(
  toastr: ToastrService,
  isSuccess: (isSuccess: boolean) => void,
  functionName: string = ''
): {
  success: ((value: Object) => void) | undefined;
  error: ((error: any) => void) | undefined;
} {
  return {
    success: (response: any) => {
      if (response.success) {
        toastr.success(`La operación se ha completado exitosamente`, functionName);
        isSuccess(true);
        return;
      }
      if (response?.result?.ventanillaExists) {
        toastr.error('No fue posible registrar la oficina, la clave de ventanilla ya existe', functionName);
        isSuccess(false);
        return;
      }
      toastr.error(
        'Ocurrió un error al actualizar la oficina. Por favor inténtelo de nuevo más tarde.',
        functionName
      );
      isSuccess(false);
      return;
    },
    error: (error: any) => {
      toastr.error(
        'Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde.',
        functionName
      );
      isSuccess(false);
      return;
    },
  };
}

export function serverErrorToast(toastr: ToastrService, error: any, title: string = ''): void {
  toastr.error(
    `Hubo un problema al realizar la acción. Por favor inténtelo de nuevo más tarde. ${error.message ?? ''}`,
    title
  );
}

export function requestErrorToast(toastr: ToastrService, error: string, title: string = ''): void {
  toastr.error(
    `Hubo un problema al realizar la acción. Por favor inténtelo de nuevo más tarde. ${error ?? ''}`,
    title
  );
}

function returnEmptyPaginatedList(isFromServer: boolean, toastr: ToastrService, title: string, error: string, getList: (data: { list: Array<any>; total: number }) => void): any {
  isFromServer ?  serverErrorToast(toastr, error) : requestErrorToast(toastr, error);
  return getList({
    list: [],
    total: 0,
  });
}

function returnEmptyList(isFromServer: boolean, toastr: ToastrService, title: string, error: string, getList: (data: Array<any>) => void): any {
  isFromServer ?  serverErrorToast(toastr, error) : requestErrorToast(toastr, error);
  return getList([]);
}

