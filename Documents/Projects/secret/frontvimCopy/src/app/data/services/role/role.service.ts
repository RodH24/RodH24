import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Role } from '@types';

type RoleType = typeof Role;

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private ENTITY = 'role';
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public getRolList(
    getList: (list: Array<RoleType>) => void,
  ) {
    this.httpClient
      .put(`${environment.UTILS_API}/v1/${this.ENTITY}/list`, {  })
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

  public getRolRequirementsList(
    getList: (list: Array<RoleType>) => void,
  ) {
    this.httpClient
      .get(`${environment.UTILS_API}/v1/${this.ENTITY}/list/requirements`, {  })
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

  public addRemoveActionRol(
    roleId:string,
    actionId:string,
    isSuccess: (isSuccess: boolean) => void
    ): void {
      this.httpClient
        .put(`${environment.UTILS_API}/v1/${this.ENTITY}/action/addRemove`, {
          roleId: roleId,
          actionId: actionId,
        })
        .pipe(first())
        .subscribe( (response: any) => {
          if (response.success) {
            isSuccess(response.result);
            return;
          } else {
            this.toastr.error(
              'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
            );
            isSuccess(false);
            return;
          }
        },
        (error: any) => {
          isSuccess(false);
          this.toastr.error(
            'Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.'
          );
          return;
        });
    }

    public createRol(
      newData:any,
      isSuccess: (isSuccess: boolean) => void
      ): void {

        this.httpClient
          .post(`${environment.UTILS_API}/v1/${this.ENTITY}/create`, { newData })
          .pipe(first())
          .subscribe( (response: any) => {
            if (response.success) {
              isSuccess(response.result);
              return;
            } else {
              this.toastr.error(
                'Hubo un problema al crear el Rol. Por favor inténtelo de nuevo más tarde.'
              );
              isSuccess(false);
              return;
            }
          },
          (error: any) => {
            isSuccess(false);
            this.toastr.error(
              'Hubo un problema al crear el Rol. Por favor inténtelo de nuevo más tarde.'
            );
            return;
          });
      }

      public updateRol(
        rolId:string,
        newData:any,
        isSuccess: (isSuccess: boolean) => void
        ): void {
          this.httpClient
            .put(`${environment.UTILS_API}/v1/${this.ENTITY}/update`, {
              rolId,
              newData
            })
            .pipe(first())
            .subscribe( (response: any) => {
              if (response.success) {
                isSuccess(response.result);
                return;
              } else {
                this.toastr.error(
                  'Hubo un problema al actualizar el Rol. Por favor inténtelo de nuevo más tarde.'
                );
                isSuccess(false);
                return;
              }
            },
            (error: any) => {
              isSuccess(false);
              this.toastr.error(
                'Hubo un problema al actualizar el Rol. Por favor inténtelo de nuevo más tarde.'
              );
              return;
            });
        }

}