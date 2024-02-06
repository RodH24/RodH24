import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ModalidadType, PaginationType, ProgramType } from '@app/data/types';
import { ResponseFunctions } from '@app/data/functions';

@Injectable({
  providedIn: 'root',
})
export class ModalidadService {
  private readonly entity: string = 'modalidad';

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  public create(
    programId: string,
    modalidad: ModalidadType,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/create`,
        { programId, modalidad })
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
    modalidad: ModalidadType,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/edit`,
        { programId, modalidad })
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
    setActive: boolean,
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/pause`,
        { programId, modalidadId, setActive })
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
    getSuccess: (isSuccess: boolean) => void
  ): void {
    const handleFunction = ResponseFunctions.handleSuccessResponse(this.toastr, getSuccess)
    this.httpClient
      .post(`${environment.PROGRAM_API}/v1/${this.entity}/delete`,
        { programId, modalidadId })
      .pipe(first())
      .subscribe(
        {
          next: handleFunction.success,
          error: handleFunction.error
        }
      )
  }
}