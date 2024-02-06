import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNameWithoutRol'
})
export class FormatNameWithoutRolPipe implements PipeTransform {

  transform(name:any): any {
    let new_name = name.split("(")[0];
    return new_name;
  }
}
