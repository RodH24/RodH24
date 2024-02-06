import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ModalidadType } from '@app/data/types';
import { ResponseFunctions } from '@app/data/functions';
import { ApoyoType } from '@app/data/types/programType';

@Injectable({
  providedIn: 'root',
})
export class ApoyoService {
  private readonly entity: string = 'apoyo';

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  public create(
    programId: string,
    modalidadId: string,
    apoyo: ApoyoType,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/create`,
        { programId, modalidadId, apoyo })
      .pipe(first())
      .subscribe(
        {
          next: handleFunction.success,
          error: handleFunction.error
        }
      )
  }

  public edit(
    programId: string,
    modalidadId: string,
    apoyo: ApoyoType,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/edit`,
        { programId, modalidadId, apoyo })
      .pipe(first())
      .subscribe(
        {
          next: handleFunction.success,
          error: handleFunction.error
        }
      )
  }

  public pause(
    programId: string,
    modalidadId: string,
    apoyoId: string,
    setActive: boolean,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/pause`,
        { programId, modalidadId, apoyoId, setActive })
      .pipe(first())
      .subscribe(
        {
          next: handleFunction.success,
          error: handleFunction.error
        }
      )
  }

  public delete(
    programId: string,
    modalidadId: string,
    apoyoId: string,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/delete`,
        { programId, modalidadId, apoyoId })
      .pipe(first())
      .subscribe(
        {
          next: handleFunction.success,
          error: handleFunction.error
        }
      )
  }
}