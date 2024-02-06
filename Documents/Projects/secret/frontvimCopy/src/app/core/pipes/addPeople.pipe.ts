import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addPeople'
})
export class addPeoplePipe implements PipeTransform {

  transform(beneficiary:any): string {
    let total = 0;
    total = total + parseInt(beneficiary['hombres']) + parseInt(beneficiary['mujeres']);
    return total + ''
  }
}
