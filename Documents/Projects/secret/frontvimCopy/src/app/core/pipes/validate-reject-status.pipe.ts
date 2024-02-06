import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateRejectStatus'
})
export class ValidateRejectStatusPipe implements PipeTransform {

  transform(data:any): string {
    if(data != undefined && data.hasOwnProperty('id') && data.hasOwnProperty('descripcion')){
      return data.id + '<br>' + data.descripcion;
    }
    else{
      return '';
    }
  }

}
