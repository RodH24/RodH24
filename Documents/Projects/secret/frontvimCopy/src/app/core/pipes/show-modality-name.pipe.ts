import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showModalityName'
})
export class ShowModalityNamePipe implements PipeTransform {

  transform(program: any): string {
    return program.modalidad.nombre ?? program.modalidad;
  }

}
