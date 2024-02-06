import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { newVentanilla, Ventanilla } from '@app/data/types';
import * as L from 'leaflet';

@Component({
  selector: 'app-office-map-modal',
  templateUrl: './office-map-modal.component.html',
  styleUrls: ['./office-map-modal.component.scss'],
})
export class OfficeMapModalComponent implements OnInit {
  @Input() office: Ventanilla = newVentanilla;
  @Output() onCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  private map: any;

  constructor() {}

  ngOnInit(): void { 
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Handle modal close event
   * Emit the close modal event to hide on parent component
   */
  public onClose(emit: boolean = false): void {
    this.onCloseModal.emit(emit);
  }

  private initMap(): void {
    const coordinates = this.office.domicilio.georeferencia;

    this.map = new L.Map('map').setView(coordinates, 15)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://dgtit.guanajuato.gob.mx/#/">DGTIT</a>',
      maxZoom: 18,
    }).addTo(this.map);

    // To hide powered by leaflet
    this.map.attributionControl.setPrefix('');

    var custom_icon = L.icon({
      iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
      iconSize: [38, 95],
      iconAnchor: [20, 70],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker(coordinates, { icon: custom_icon });
    marker.addTo(this.map);
  }
}
