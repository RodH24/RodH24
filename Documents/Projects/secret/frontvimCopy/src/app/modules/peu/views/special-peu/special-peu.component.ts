import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MiniKpiDetailModality } from '@app/data/types';
import { CookieService } from 'ngx-cookie-service';
import { PaginatorEntity, SessionEntity, TokenEntity } from '@app/data/entities';
import { NgxSpinnerService } from 'ngx-spinner';
import { PeuSpecialService } from '@data/services';
import * as L from 'leaflet';
import * as XLSX from "xlsx";
import { gtoGeoJson } from '../../../../../assets/files/gto';
import { impulseZonesgtoGeoJson } from 'src/assets/maps/222_zonas_23Marzo2022';
import { SolicitudPanelFunctions } from '@app/data/functions';

@Component({
  selector: 'special-peu',
  templateUrl: './special-peu.component.html',
  styleUrls: ['./special-peu.component.scss']
})
export class SpecialPeuComponent implements OnInit, AfterViewInit {
  public paginator: PaginatorEntity = new PaginatorEntity();
  public token: TokenEntity;
  public session: SessionEntity;
  public map: any;
  public layer_group: any;
  public kpi_card_list: Array<MiniKpiDetailModality> = [
    {
      title: 'Mujeres Apoyadas',
      count: 0,
      color: 'pink',
      imageUrl: 'woman.png',
      isActive: false,
      filter: 'FEMENINO'
    },
    {
      title: 'Hombres Apoyados',
      count: 0,
      color: 'blue',
      imageUrl: 'man.png',
      isActive: false,
      filter: 'MASCULINO'
    },
    {
      title: 'Municipios Apoyados',
      count: 0,
      color: 'yellow',
      imageUrl: 'guanajuato.png',
      isActive: false,
      filter: 'MUNICIPALITY'
    },
    {
      title: 'Apoyo en zonas impulso',
      count: 0,
      color: 'dark-blue',
      imageUrl: 'impulse_zone.png',
      isActive: false,
      filter: 'IMPULSE_ZONE'
    },
  ];
  public special_data: Array<any> = [];
  public list_modalities: Array<any> = [];
  public index_women: number = 0;
  public index_men: number = 0;
  public index_municipality: number = 0;
  public index_impulse_zone: number = 0;
  public showSelect: boolean = false;
  public sessionQlist: Array<any> = [];
  private selectedApoyo: string = '-';

  constructor(
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private peuSpecialService: PeuSpecialService
  ) {
    this.session = new SessionEntity();
    this.token = new TokenEntity(this.cookieService);
    this.index_women = this.kpi_card_list.findIndex((obj => obj.filter == 'FEMENINO'));
    this.index_men = this.kpi_card_list.findIndex((obj => obj.filter == 'MASCULINO'));
    this.index_municipality = this.kpi_card_list.findIndex((obj => obj.filter == 'MUNICIPALITY'));
    this.index_impulse_zone = this.kpi_card_list.findIndex((obj => obj.filter == 'IMPULSE_ZONE'));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.fillInitialData();
  }

  public fillInitialData(): void {
    // #1
    this.peuSpecialService.getCountDataBySupportType('FEMENINO', SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo), (success: any) => {
      this.kpi_card_list[this.index_women].count = success['result']['count'];
      this.fillMapSex(success['result']['detail']);
      this.spinner.hide();
    });
    // #2
    this.peuSpecialService.getCountDataBySupportType('MASCULINO', SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo), (success: any) => {
      this.kpi_card_list[this.index_men].count = success['result']['count'];
      this.fillMapSex(success['result']['detail']);
      this.spinner.hide();
    });
    // #3
    this.peuSpecialService.getCountDataByMunicipality('MUNICIPALITY', SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo), (success: any) => {
      if (success['result'].length === 0) {
        this.kpi_card_list[this.index_municipality].count = 0;
        this.spinner.hide();
      }
      else {
        this.kpi_card_list[this.index_municipality].count = success['result']['data'].length;
        this.fillMunicipalityJson(success['result']['data']);
        this.spinner.hide();
      }
    });
    // #4
    this.peuSpecialService.getCountDataByImpulseZone(SolicitudPanelFunctions.validateKeyOnSelectedQ(this.selectedApoyo), (success: any) => {
      this.kpi_card_list[this.index_impulse_zone].count = success['result'];
      this.spinner.hide();
    });

  }

  public initMap(): void {
    let coordinates_of_living: Array<any> = [];
    coordinates_of_living = [21.0181, -101.258]

    //Here we have to reverse the coordinates to show point on map
    // let y = coordinates_of_living[0]
    // let x = coordinates_of_living[1]
    this.map = new L.Map("map");

    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://dgtit.guanajuato.gob.mx/#/"> | DGTIT | </a>',
      maxZoom: 18,
    }).addTo(this.map);

    // To hide powered by leaflet
    this.map.attributionControl.setPrefix("");

    // Se define que la vista inicial sea en Gto.
    var gto = new L.LatLng(21.0181, -101.258);
    //Con un zoom de 8 para que se alcance a visualizar el estado completo
    this.map.setView(gto, 8);

    let estilosGto = {
      color: "#12A2A2",
      weight: 1,
      opacity: 0.65,
    };
    // GeoJson que muestra el estado de Gto con todos sus municipios
    L.geoJSON(gtoGeoJson, {
      style: estilosGto,
    }).addTo(this.map);

    let impulseZonesStyles = {
      color: "#F25230",
      weight: 1,
      opacity: 0.65,
    };
    L.geoJSON(impulseZonesgtoGeoJson, {
      style: impulseZonesStyles,
    }).addTo(this.map);

    var custom_icon = L.icon({
      iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
      iconSize: [38, 95],
      iconAnchor: [20, 70],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76],
    });

    // const marker = L.marker(coordinates_of_living, { icon: custom_icon });
    // marker.addTo(this.map);
    this.map.setView(coordinates_of_living, 8);
  }

  public exportData(data: any): void {
    let data_to_export = [];
    let obj_to_export = {
      folio: data['folio'],
      clave_programa: data['programa']['q'],
      nombre_programa: data['programa']['nombre'],
      clave_modalidad: data['programa']['modalidad']['clave'],
      nombre_modalidad: data['programa']['modalidad']['nombre'],
      autoriza_contacto: data['tarjetaImpulso']['autorizaContacto'],
      costo_aproximado: data['detalleSolicitud']['costoAproximado'],
      dependencia: data['dependencia']['nombre'],
      sociedad: data['dependencia']['sociedad'],
      codigo: data['dependencia']['codigo'],
      siglas: data['dependencia']['siglas'],
      eje: data['dependencia']['eje']['descripcion'],
      nombre: data['ciudadano']['nombreCompleto'],
      curp: data['ciudadano']['curp'],
      fecha_nacimiento: data['ciudadano']['fechaNacimientoTexto'],
      genero: data['ciudadano']['genero'],
      nacionalidad: data['ciudadano']['nacionalidad'],
      edad: data['ciudadano']['edad'],
      estadoCivil: data['ciudadano']['estadoCivil'],
      entidadFederativa: data['ciudadano']['domicilio']['entidadFederativa']['nombre'],
      municipio: data['ciudadano']['domicilio']['municipio']['nombre'],
      localidad: data['ciudadano']['domicilio']['localidad']['nombre'],
      zona_impulso: data['ciudadano']['domicilio']['zonaImpulso']['nombre'],
      domicilio_completo: data['ciudadano']['domicilio']['completo'],
      comunidad_indigena: data['ciudadano']['comunidadIndigena']['descripcion'],
    };

    data_to_export.push(obj_to_export)

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data_to_export);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    XLSX.writeFile(wb, 'reporte.xlsx');
  }

  public searchData(type: string | undefined): void {
    this.spinner.show();

    // if (type === 'FEMENINO') {
    //   this.peuSpecialService.getCountDataBySex(type, this.validateKeyOnSelectedQ(this.selectedQ), (success: any) => {
    //     this.kpi_card_list[this.index_women].count = success['result']['count'];
    //     this.fillMapSex(success['result']['detail']);
    //     this.spinner.hide();
    //   });
    // }
    // if (type === 'MASCULINO') {
    //   this.peuSpecialService.getCountDataBySex(type, this.validateKeyOnSelectedQ(this.selectedQ), (success: any) => {
    //     this.kpi_card_list[this.index_men].count = success['result']['count'];
    //     this.fillMapSex(success['result']['detail']);
    //     this.spinner.hide();
    //   });
    // }
    // if (type === 'MUNICIPALITY') {
    //   this.peuSpecialService.getCountDataByMunicipality(this.validateKeyOnSelectedQ(this.selectedQ), (success: any) => {
    //     this.kpi_card_list[this.index_municipality].count = success['result']['data'].length;
    //     this.fillMunicipalityJson(success['result']['data']);
    //     this.spinner.hide();
    //   });
    // }
    // if (type === 'IMPULSE_ZONE') {
    //   this.peuSpecialService.getCountDataByImpulseZone(this.validateKeyOnSelectedQ(this.selectedQ), (success: any) => {
    //     this.kpi_card_list[this.index_impulse_zone].count = success['result'];
    //     this.spinner.hide();
    //   });
    // }
  }

  public fillMunicipalityJson(array_minicipalities: Array<string>) {
    let latlang = this.findPolygonOnGeoJson(array_minicipalities);
    L.geoJSON(latlang).addTo(this.map);
  }

  public fillMapSex(detail: any) {
    // this fill table detail
    this.special_data = detail;

    if (this.layer_group == undefined) {
      this.defineMap(detail);
    }
    else {
      this.layer_group.clearLayers();
      this.defineMap(detail);
    }
  }

  public defineMap(detail: any) {
    let new_data_detail_map: Array<any> = [];
    for (let m of detail) {
      let latitude = m['ciudadano']['domicilio']['georeferencia']['coordinates'][0]
      let longitude = m['ciudadano']['domicilio']['georeferencia']['coordinates'][1]
      let texto = `
      <p>
        <span>Programa: ${m['programa']['q']} - ${m['programa']['nombre']}</span></br>
        <span>Modalidad: ${m['programa']['modalidad']['clave']} - ${m['programa']['modalidad']['nombre']}</span></br>
        <span>Folio: ${m['folio']}</span></br>
        <span>Costo aproximado: $${m['detalleSolicitud']['costoAproximado']}</span></br>
        <span>Nombre: ${m['ciudadano']['nombreCompleto']}</span></br>
        <span>Genero: ${m['ciudadano']['genero']}</span></br>
        <span>Nacionalidad: ${m['ciudadano']['nacionalidad']}</span></br>
        <span>Edad: ${m['ciudadano']['edad']} Años</span></br>
      </p>
      `;
      var position_marker = new L.LatLng(latitude, longitude);
      var custom_icon = L.icon({
        iconUrl: "../../../../../assets/images/iconos/maps/location.svg",
        iconSize: [38, 95],
        iconAnchor: [20, 70],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      });

      new_data_detail_map.push(
        L.marker(position_marker, { icon: custom_icon })
          .bindPopup(texto)
          .on("popupopen", (a: any) => {
            var popUp = a.target.getPopup();
            popUp
              .getElement()
              .querySelector(".btnObra")
              .addEventListener("click", (e: any) => {
                // this.VerImagen(e.target.name);
              });
          })
      );
    }
    this.layer_group = L.layerGroup(new_data_detail_map);
    this.map.addLayer(this.layer_group);
  }

  public findPolygonOnGeoJson(distinct_municipalities: any): any {
    let result = []

    // iterates over array of received municipalities affected
    for (let municipality of distinct_municipalities) {
      let municipality_parsed = this.removeAccents(municipality).toUpperCase()
      for (let m of gtoGeoJson.features) {
        let municipality_geo_json = this.removeAccents(m['properties']['mun_name']).toUpperCase();
        if (municipality_geo_json === municipality_parsed) {
          result.push(m);
        }
      }
    }

    return result
  }

  public removeAccents(str: any): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  public onIndexChange(pageIndex: number): void {
    this.paginator.pageIndex = pageIndex;
  }

  public updateSelectedApoyo(apoyo: any) {
    this.selectedApoyo = apoyo;
    this.fillInitialData()
  }
}
