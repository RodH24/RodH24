import { Component, OnInit, Input, Output, EventEmitter/*, AfterViewInit*/ } from '@angular/core';
import { UtilsService } from '@data/services';
import { NgxSpinnerService } from "ngx-spinner";
import * as L from 'leaflet';
import { gtoGeoJson, municipalitiesGtoGeoJson, getValueFromMunicipality } from 'src/assets/files/gto';


@Component({
  selector: 'app-modal-confirm-adress',
  templateUrl: './modal-confirm-adress.component.html',
  styleUrls: ['./modal-confirm-adress.component.scss']
})
export class ModalConfirmAdressComponent implements OnInit {

  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() changeStep = new EventEmitter<any>();
  @Input() dataResponse: any;
  @Input() formData: any;
  public originalPointMarker: any;
  public googlePointMarker: any;
  public newPointMarker: any;
  public map: any;
  public colonia: string = '';
  public cp: string = '';
  public exterior: string = '';
  public interior: string = '';
  public estado: string = '';
  public municipio: string = '';
  public calle: string = '';
  public lat: any;
  public long: any;
  public googleAdress: string = '';
  public isConfirmedAdress: boolean = false;
  public newCoords: Array<any> = [];
  public newLocationSelected: string = "";

  constructor(
    private utilsService: UtilsService,
    public spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.colonia = this.formData.value.asentamiento.tipo + ' ' + this.formData.value.asentamiento.nombre;
    this.cp = this.formData.value.cp;
    this.exterior = this.formData.value.numeroExt;
    this.interior = this.formData.value.numeroInt;
    this.estado = this.formData.value.entidadFederativa;
    this.municipio = this.formData.value.municipio;
    this.calle = this.formData.value.calle;
    this.lat = this.dataResponse.data.coordinates[0];
    this.long = this.dataResponse.data.coordinates[1];

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    let coordinates_of_living: Array<any> = [this.lat, this.long];

    this.ExistsOnGtoState(this.formData.value.municipio, this.dataResponse, coordinates_of_living, (response) => {
      let coordinates_of_living: Array<any> = response.response;

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

      var originalMarker = L.icon({
        iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
        iconSize: [38, 95],
        iconAnchor: [20, 70],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      });
      var googleMarker = L.icon({
        iconUrl: "../../../../../assets/images/iconos/maps/locationRed.svg",
        iconSize: [38, 95],
        iconAnchor: [20, 70],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      });
      var correctMarker = L.icon({
        iconUrl: "../../../../../assets/images/iconos/maps/locationBlue.svg",
        iconSize: [38, 95],
        iconAnchor: [20, 70],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      });

      // Color for gto state 
      let gtoStyles = {
        color: "#12A2A2",
        weight: 1,
        opacity: 0.65,
      };

      L.geoJSON(gtoGeoJson, {
        style: gtoStyles
      }).addTo(this.map);

      // original marker 
      this.originalPointMarker = L.marker(coordinates_of_living, { icon: originalMarker }).on('click', this.onSelectMarker).addTo(this.map);
      // google marker
      if (this.dataResponse.data.google.result.geometry) {
        this.googleAdress = this.dataResponse.data.google.result.formatted_address;
        this.googlePointMarker = L.marker([this.dataResponse.data.google.result.geometry.location.lat, this.dataResponse.data.google.result.geometry.location.lng], { icon: googleMarker }).on('click', this.onSelectMarker).addTo(this.map);
      }

      this.map.on("click", (e: any) => {
        let latitude = e.latlng.lat;
        let longitude = e.latlng.lng

        // Enable button for acepting new adress 
        this.isConfirmedAdress = true;
        // remove original point marker
        this.map.removeLayer(this.originalPointMarker);

        if (this.dataResponse.data.google.result.geometry) {
          this.map.removeLayer(this.googlePointMarker);
        }

        if (this.newPointMarker) {
          // Remove the marker layer 
          this.map.removeLayer(this.newPointMarker);
        }

        let newLatitude = latitude.toPrecision(8);
        let newLongitude = longitude.toPrecision(9);

        // on new adress 
        this.newCoords = [newLatitude, newLongitude]

        // Add marker on map 
        this.newPointMarker = new L.marker([latitude, longitude], { icon: correctMarker }).on('click', this.onSelectMarker).addTo(this.map);

        this.spinner.show();

        this.utilsService.getAddressFromCoords(latitude, longitude, (data: any) => {
          let state = (data[1] == null) ? ("") : (data[1]);
          let municipality = (data[3] == null) ? ("") : (data[3]);
          let colony = (data[7] == null) ? ("") : (data[7]);
          let cp = (data[6] == null) ? ("") : (data[6]);

          this.newLocationSelected = state + " " + municipality + " " + colony + " " + cp
          this.spinner.hide();
        });
      });

      this.map.setView(coordinates_of_living, 15);
    });
  }

  public ExistsOnGtoState(municipality: string, dataResponse: any, coordinates_of_living: any, callback: (response: any) => void): void {
    // dataResponse.data.google.result.address_components[3].log_name

    // Validate if SDESH return nothing usefull 
    let sdeshResponse = (dataResponse.data.sdsh.message == 'Failed: Not data found') ? (false) : (true);
    // Validate if google return '' 
    let zipCodesResponse = (dataResponse.data.zipCodes.google == 'No encontrado') ? (false) : (true);

    //return data to center of main municipality
    if (sdeshResponse == false && zipCodesResponse == false) {
      //transform text
      // 1) lower case
      let newMunicipality = municipality.toLowerCase();
      // 2) Remove accents
      newMunicipality = this.removeAccents(newMunicipality);
      // 3) Replace white space with _
      newMunicipality = newMunicipality.replace(/\s/g, '_')

      callback({
        status: false,
        response: municipalitiesGtoGeoJson[newMunicipality]
      });
    } else {
      callback({
        status: true,
        response: coordinates_of_living
      });
    }
  };

  public removeAccents(stringPhrase: string) {
    const accents: { [key: string]: string } = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
    return stringPhrase.split('').map(letter => accents[letter] || letter).join('').toString();
  }

  public onSelectMarker(event: any): void {
    // Uses the coords clicked on pin (on use previus coords)
    this.newCoords = [event.latlng.lat, event.latlng.lng]

  }

  public interactModal(): void {
    this.closeModalEvent.emit('hideRejectModal');
  }

  public confirmAdress(): void {
    this.formData.value.coordenadas = this.newCoords;
    this.changeStep.emit(this.formData)
  }
}
