import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'test'
})
export class TrimKpiClassPipe implements PipeTransform {

  transform(kpi_class:any): string {
    return kpi_class.toLowerCase().replace(' ','-').replace('ó','o');
  }

}
