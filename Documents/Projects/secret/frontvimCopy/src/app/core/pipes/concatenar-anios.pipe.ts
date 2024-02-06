import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concatenarAnios'
})
export class ConcatenarAniosPipe implements PipeTransform {

  transform(anios: number | string): string {
    let anios_str = anios.toString()
    return anios_str + ' Años';
  }

}
