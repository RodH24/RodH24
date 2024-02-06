import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ResponseFunctions } from '@app/data/functions';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private ENTITY = 'action';
  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  public getActionList(
    getList: (list: Array<any>) => void,
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
            this.toastr.error('Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.');
            getList([]);
            return;
          }
        },
        (error: any) => {
          getList([]);
          this.toastr.error('Hubo un problema al procesar la solicitud. Por favor inténtelo de nuevo más tarde.');
          return;
        }
      );
  }

public createAction(
  parent:string|null,
  _id:string,
  name:string,
  isSuccess: (isSuccess: boolean) => void
  ): void {

    this.httpClient
      .post(`${environment.UTILS_API}/v1/${this.ENTITY}/create`, { parent,_id,name })
      .pipe(first())
      .subscribe( (response: any) => {
        if (response.success) {
          this.toastr.success('La acción ha sido registrada.');
          isSuccess(response.result);
          return;
        } else {
          if(response.result.toastr){
            this.toastr.error(response.result.toastr);
            isSuccess(false);
            return;
          }
          this.toastr.error('Hubo un problema al crear la acción. Por favor inténtelo de nuevo más tarde.');
          isSuccess(false);
          return;
        }
      },
      (error: any) => {
        isSuccess(false);
        this.toastr.error('Hubo un problema al crear la acción. Por favor inténtelo de nuevo más tarde.');
        return;
      });
  }

}