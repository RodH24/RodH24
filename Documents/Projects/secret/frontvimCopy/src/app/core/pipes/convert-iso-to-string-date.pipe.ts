import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertIsoToStringDate'
})
export class ConvertIsoToStringDatePipe implements PipeTransform {

  transform(date:any): any {
    let d = new Date(date);
    let formatDate = d.getUTCFullYear() + '/' + d.getUTCMonth() + '/' + d.getUTCDay() + ', ' + d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds()
    return formatDate
  }

}
