import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-progress-bar',
  templateUrl: './scroll-progress-bar.component.html',
  styleUrls: ['./scroll-progress-bar.component.scss']
})
export class ScrollProgressBarComponent implements OnInit {
  
  @Input() progress!: number;
  @Input() total!: number;
  color: string = '';
  constructor() { }

  ngOnInit(): void {
    // Si no se le asigna un valor el valor por default es 0 
    if(!this.progress){
      this.progress = 0;
    }
    // si no se pasa valor para el total el default es 100
    if(this.total === 0){
      this.total = this.progress;
    }
    else if (!this.total){
      this.total = 100;
    }

    // si el avance es mayor que el total este sigue siendo 100% 
    if(this.progress > this.total){
      this.progress = 100;
      this.total = 100;
    }

    // Operacion matematica para calcular numero
    this.progress = (this.progress / this.total) * 100;

    // Esto se puede descomentar para hacer multicolor el progress 
    // if(this.progress < 55){
    //   this.color = 'red';
    // }
    // else if(this.progress < 75){
    //   this.color = 'yellow';
    // }
    // else{
    //   this.color = 'green';
    // }
    
  }


}
