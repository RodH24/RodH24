import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToArrayByComas'
})
export class StringToArrayByComasPipe implements PipeTransform {

  transform(value:any): any {
    if(value.length >= 1){
      return value[0].split(',');
    }
    else{
      return [];
    }
  }

}
