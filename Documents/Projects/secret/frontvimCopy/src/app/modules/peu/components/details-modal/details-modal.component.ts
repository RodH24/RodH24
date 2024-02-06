import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
})
export class DetailsModalComponent implements OnInit,AfterViewInit {

  @Output() onCloseModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() inputDetailModal!:any;
  public isVisible: boolean = true;
  public title_modal:string = 'Detalle desglosado';
  public array_benefesary_women:Array<any> = [];
  public array_benefesary_men:Array<any> = [];
  public program_data:any
  public lugar_data:any
  public total_women:number = 0;
  public total_men:number = 0;
  private map:any;

  constructor() {}

  ngOnInit(): void {
    this.validateBenefesaryData(this.inputDetailModal['Beneficiarios']);
    this.program_data = this.inputDetailModal['programa'];
    this.lugar_data = this.inputDetailModal['lugar'];
    this.total_women = this.inputDetailModal['totalBeneficiarios']['mujeres'];
    this.total_men = this.inputDetailModal['totalBeneficiarios']['hombres'];
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void { 
    let coordinates_of_living:Array<any> = this.lugar_data['result']['georeferencia']['coordinates'];

    if(coordinates_of_living.length == 0){
      coordinates_of_living = [21.0181, -101.258]
    }
    
    //Here we have to reverse the coordinates to show point on map
    let y = coordinates_of_living[0]
    let x = coordinates_of_living[1]
    this.map = new L.Map("map");

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://dgtit.guanajuato.gob.mx/#/"> | DGTIT | </a>',
      maxZoom: 18,
    }).addTo(this.map);

    // To hide powered by leaflet
    this.map.attributionControl.setPrefix("");

    var custom_icon = L.icon({
      iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
      iconSize: [38, 95],
      iconAnchor: [20, 70],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker(coordinates_of_living,{ icon: custom_icon });
    marker.addTo(this.map);
    this.map.setView(coordinates_of_living, 15);
  }

  public validateBenefesaryData(base_array:Array<any>){

    for(let m of base_array){
      if(m['genero'] === 'FEMENINO'){
        this.array_benefesary_women.push(m);
      }else{
        this.array_benefesary_men.push(m);
      }
    }
  }

  public handleCancel() {
    this.onCloseModalEvent.emit(false);
  }
}
