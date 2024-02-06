import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ResponseFunctions } from '@app/data/functions';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly ENTITY = 'user';

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  public list(
    page: { pageSize: number; pageIndex: number } | null,
    status: string | null,
    dependencyId: string | null,
    word: string | null,
    getList: (data: { list: Array<any>; total: number }) => void
  ): void {
    const handlePaginatedListResponse = ResponseFunctions.handlePaginatedListResponse(this.toastr, getList, 'User List')
    let url = `${environment.USER_API}/v1/${this.ENTITY}/list`;
    url += page ? `?size=${page.pageSize}&index=${page.pageIndex}` : '';

    this.httpClient
      .put(url,
        {
          status,
          dependencyId,
          word
        }
      )
      .pipe(first())
      .subscribe(handlePaginatedListResponse.success, handlePaginatedListResponse.error);
  }

  public userRoleData(
    userId: string,
    arrId: string,
    getData: (data: any) => void
  ): void {
    this.httpClient
    .put(`${environment.USER_API}/v1/${this.ENTITY}/role-info`,
      {
        userId,
        arrId
      }
    ).pipe(first())
    .subscribe(
      (response: any) => {
          if (response.success) {
            
            return getData(response.result);
          } else {
            this.toastr.error(
              'Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde.', 'Get Role Data'
            );
          }
          getData({});
      },
      (error) => {
        getData({});
        this.toastr.error(
          'Hubo un problema al procesar su solicitud. Por favor inténtelo de nuevo más tarde.', 'Get Role Data'
        );
      }
    );
  }

  public updateUserData(userId: string, newData: any, getSuccess: (success: boolean) => void): void {
    const office=newData.oficina?newData.oficina.split("|", 2)[0]:null;
    const window=newData.oficina?newData.oficina.split("|", 2)[1]:null;
    this.httpClient
      .put(`${environment.USER_API}/v1/${this.ENTITY}/attributes`, {
        userId,
        user: {
          name: newData.name,
          email: newData.email
        },
        action: "update",
        enabled: true,
        dependencia: newData.dependencia,
        office: office,
        ventanilla: window,
      }).pipe(first()).subscribe(
        (response: any) => {
          if(!response.success)
            this.toastr.error('Hubo un problema al Actualizar el Usuario', 'Update User');
          return getSuccess(response.success?response.success:false);
        },
        (error) => {
          this.toastr.error('Hubo un problema al Actualizar el Usuario', 'Update User');
          return getSuccess(false);
        }
      );
  }

  
  public activateUser(
    userId: string,
    role: string,
    dependencia: string,
    programa: string,
    clavesQ: Array<string>,
    oficina: string,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = this.handleUpdateResponse(isSuccess);

    this.httpClient
      .put(`${environment.USER_API}/v1/${this.ENTITY}/activate`, {
        userId,
        role,
        dependencia,
        programa,
        clavesQ,
        oficina,
      })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public enable(
    userId: string,
    getResponse: (isSuccess: boolean) => void
  ): void {
    this.httpClient
      .put(`${environment.USER_API}/v1/${this.ENTITY}/activate`, {
        id: userId,
      })
      .pipe(first())
      .subscribe(
        (response) => {
          const res = response as any;
          if (res.success) {
            this.toastr.success('El usuario se ha activado exitosamente.');
          } else {
            this.toastr.error(
              'Hubo un problema al activar al usuario. Inténtelo más tarde.'
            );
          }
          getResponse(res.success);
        },
        (error) => {
          getResponse(false);
          this.toastr.error('Hubo un problema al procesar su solicitud.');
        }
      );
  }

  public disable(
    userId: string,
    getResponse: (isSuccess: boolean) => void
  ): void {
    this.httpClient
      .put(`${environment.USER_API}/v1/${this.ENTITY}/deactivate`, {
        id: userId,
      })
      .pipe(first())
      .subscribe(
        (response) => {
          const res = response as any;
          if (res.success) {
            this.toastr.success('El usuario se ha desactivado exitosamente.');
          } else {
            this.toastr.error(
              'Hubo un problema al desactivar al usuario. Inténtelo más tarde.'
            );
          }
          getResponse(res.success);
        },
        (error) => {
          getResponse(false);
          this.toastr.error('Hubo un problema al procesar su solicitud.');
        }
      );
  }

  

/* Rol Management Data*/
public addUserRol(
  user: string,
  role:string,
  newData: any,
  isSuccess: (isSuccess: boolean) => void
): void {
  const dependencia= newData?.dependencias||"";
  const apoyos=newData?.apoyos || null;
  const clavesQ=newData?.clavesQ  || null;
  const modalidades= newData?.modalidades || null;
  const regiones= newData?.regiones || null;

  const handleResponse = this.handleUpdateResponse(isSuccess);
  this.httpClient
    .post(`${environment.USER_API}/v1/${this.ENTITY}/role`, {
      user,role,dependencia,apoyos,clavesQ,modalidades,regiones,
    })
    .pipe(first())
    .subscribe(handleResponse.success, handleResponse.error);
}


public updateUserRol(
  user: string,
  roleArrid:string,
  action:string,
  newData: any,
  isSuccess: (isSuccess: boolean) => void
): void {
  const handleResponse = this.handleUpdateResponse(isSuccess);
  const status= newData?.status?{
    enabled: newData?.status=='enabled'?true:false,
    deleted: newData?.status=='deleted'?true:false,
    pending: newData?.status=='pending'?true:false
  }:null;
  const dependencias= newData?.dependencias||"";
  const apoyos=newData?.apoyos || null;
  const clavesQ=newData?.clavesQ  || null;
  const modalidades= newData?.modalidades || null;
  const regiones= newData?.regiones || null;
  this.httpClient
    .put(`${environment.USER_API}/v1/${this.ENTITY}/role`, {
      user,roleArrid,action,
      status,dependencias,apoyos,clavesQ,modalidades,regiones
    })
    .pipe(first())
    .subscribe(handleResponse.success, handleResponse.error);
}

public createUserByPanel(
  user:{name: string,
  email: string,
  office: string,
  ventanilla: string,
  dependenciaUsuario: string,
  role: string,
  dependencia: string,
  clavesQ: Array<string> | null,
  apoyos: Array<string> | null,
  regiones: Array<string> | null},
  isSuccess: (isSuccess: boolean) => void
): void {
  const officeData=user.office.split("|", 2)[0];
  const window=user.office.split("|", 2)[1];
  user.office=officeData;
  user.ventanilla=window;
  const handleResponse = this.handleCreateResponse(isSuccess);
  this.httpClient
    .post(`${environment.USER_API}/v1/${this.ENTITY}/create`, {
      user,
    })
    .pipe(first())
    .subscribe(handleResponse.success, handleResponse.error);
}

  /////////////
 /* public disable(
    userId: string,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = this.handleUpdateResponse(isSuccess);

    this.httpClient
      .put(`${environment.USER_API}/v1/${this.ENTITY}/disable`, { userId })
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }
*/


  


  public create(
    token: string,
    dependencia: string,
    oficina: string,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const headers = new HttpHeaders()
      .set(
        'Authorization',
        `Bearer ${environment.GEG_IMPULSO_AUTH_TOKEN_API_KEY}`
      )
      .set('nonLogged', 'true');
    const handleResponse = this.handleCreateResponse(isSuccess);

    this.httpClient
      .post(
        `${environment.LOGIN_API}/v1/${this.ENTITY}/create`,
        { token, dependencyId: dependencia, office: oficina },
        { headers: headers }
      )
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }

  public creatByPanel(
    name: string,
    email: string,
    role: string,
    dependencia: string,
    programa: string | null,
    clavesQ: Array<string>,
    oficina: string,
    isSuccess: (isSuccess: boolean) => void
  ): void {
    const handleResponse = this.handleUpdateResponse(isSuccess);

    this.httpClient
      .post(
        `${environment.USER_API}/v1/${this.ENTITY}/create`,
        { name, email, role, dependencia, programa, clavesQ, oficina }
      )
      .pipe(first())
      .subscribe(handleResponse.success, handleResponse.error);
  }





  

  private handleUpdateResponse(isSuccess: (isSuccess: boolean) => void): {
    success: ((value: Object) => void) | undefined;
    error: ((error: any) => void) | undefined;
  } {
    return {
      success: (response: any) => {
        if (response.success) {
          this.toastr.success('El usuario se ha actualizado correctamente');
          isSuccess(true);
          return;
        }

        if (response?.result?.userExists) {
          this.toastr.warning(response?.message
          );
          isSuccess(false);
          return;
        }
        this.toastr.error(
          'Ocurrió un error al actualizar el usuario. Por favor inténtelo de nuevo más tarde.'
        );
        isSuccess(false);
        return;
      },
      error: (error: any) => {
        isSuccess(false);
        return;
      },
    };
  }

  private handleCreateResponse(isSuccess: (isSuccess: boolean) => void): {
    success: ((value: Object) => void) | undefined;
    error: ((error: any) => void) | undefined;
  } {
    return {
      success: (response: any) => {
        if (response.success) {
          this.toastr.success('El usuario se ha registrado correctamente');
          isSuccess(true);
          return;
        }
        if(response.result?.user){
          this.toastr.warning(
            'Ocurrió un error al registrar el usuario. El usuario ya existe.'
          );
          isSuccess(false);
          return;
        }
        this.toastr.error(
          'Ocurrió un error al registrar el usuario. Por favor inténtelo de nuevo más tarde.'
        );
        isSuccess(false);
        return;
      },
      error: (error: any) => {
        isSuccess(false);
        return;
      },
    };
  }
}
