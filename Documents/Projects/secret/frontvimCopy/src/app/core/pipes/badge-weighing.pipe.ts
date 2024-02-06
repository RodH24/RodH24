import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badgeWeighing'
})
export class BadgeWeighingPipe implements PipeTransform {

  private class: string | undefined = 'secondary';
  private title: string | undefined = 'Sin POnderación';

  transform(weigh:number):string {
    
    if(weigh == 0){
      this.class = 'success'
      this.title = 'No vulnerable'
    }
    else if (weigh >= 5 && weigh <= 10){
      this.class = 'warning'
      this.title = 'Bajo'
    }
    else if (weigh >= 15 && weigh <= 20){
      this.class = 'dark-warning'
      this.title = 'Medio'
    }
    else if (weigh >= 25){
      this.class = 'danger'
      this.title = 'Alto'
    }
    
    return `<span class="badge bg-color-${this.class}">${this.title}</span>`;

  }
}