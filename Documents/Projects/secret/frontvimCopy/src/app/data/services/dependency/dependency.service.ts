import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { ResponseFunctions } from '@app/data/functions';

@Injectable({
  providedIn: 'root',
})
export class DependencyService {
  private readonly ENTITY = 'dependency';

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  public list(
    isFiltered: boolean = false, // la lista viene filtrada por atributos del activerole ?
    getList: (list: Array<any>) => void) {
    const handlePaginatedListResponse = ResponseFunctions.handleListResponse(this.toastr, getList, 'Program List')

    this.httpClient
      .put(`${environment.UTILS_API}/v1/${this.ENTITY}/list`, { isFiltered })
      .pipe(first())
      .subscribe(handlePaginatedListResponse.success, handlePaginatedListResponse.error);
  }
}
