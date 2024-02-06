import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatIndicatorKpiNumber',
})
export class FormatIndicatorKpiNumberPipe implements PipeTransform {

  transform(numberIndicator: any, type: string = 'indicator'): any {
    if (type == 'indicator') {
      if (numberIndicator >= 1000) {
        let numberToShow = numberIndicator / 1000
        let arrayDataNumber = numberToShow.toString().split('.')
        let kNumber = arrayDataNumber[0];
        return kNumber + 'K'
      } else {
        return numberIndicator
      }
    } else {
      if(numberIndicator && numberIndicator !== null) {
        let result = numberIndicator.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return result + ' solicitudes'
      } else {
        return '';
      }      
    }
  }
}