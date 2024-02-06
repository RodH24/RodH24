import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-contador-numero',
  templateUrl: './contador-numero.component.html',
  styleUrls: ['./contador-numero.component.scss'],
})
export class ContadorNumeroComponent implements OnInit {
  @Input() inputValue: number = 0;
  @Input() borderStyle: string = '';
  is_white_theme:boolean = false;
  is_dark_theme:boolean = false;
  
  @Output() ContadorEvento = new EventEmitter<number>();

  contador: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.contador = this.inputValue;
    this.IdentifyClass();
  }

  IdentifyClass = () => {
    if(this.borderStyle == 'white'){
      this.is_white_theme = true;
    }
    else{
      this.is_dark_theme = true;
    }
  }

  Disminuir(): void {
    if (this.contador <= 0) {
      //Numeros negativos
    } else {
      this.contador = this.contador - 1;
      this.ContadorEvento.emit(this.contador);
    }
  }
  Aumentar(): void {
    this.contador = this.contador + 1;
    this.ContadorEvento.emit(this.contador);
  }
}
