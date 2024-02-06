import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public showQaModal: boolean = false;
  public modalMsg = `
  La página que está por acceder no es Ventanilla Impulso, es un entorno de pruebas.  \n
  Toda la información aquí capturada no se reflejará en la aplicación de Ventanilla Impulso`;

  constructor() {}

  ngOnInit() {
    const url = window.location.origin;
    const qaUrl = environment.FRONT_QA;
    if(url === qaUrl) {
      this.showQaModal = true;
    }
  }

  onModalAccept() {
    this.showQaModal = false;
  }
}
