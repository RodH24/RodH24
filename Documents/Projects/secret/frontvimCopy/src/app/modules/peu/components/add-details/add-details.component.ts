import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilsService } from '@app/data/services';
import { MiniKpiDetailModality } from '@app/data/types';
import { PeuService } from '../../../../data/services/peu/peu.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';

@Component({
  selector: 'add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss'],
})
export class AddDetailsComponent implements OnInit {  
  
  @Output() onCloseModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() modality_data?: any;
  public showModal: boolean = true;
  public form_detail_peu: UntypedFormGroup;
  public tagValue:Array<any> = [];
  public title_tag:string = "CURP'S de beneficiarios"
  public list_tag_folios: Array<{ label: string; value: string }> = [];
  public showSpinner:boolean = false;
  public actual_curp_woman:number = 0;
  public actual_curp_men:number = 0;
  public monto:any;
  public date = null;
  public list_neighborhoods: Array<any> = [];
  public actual_curp_data_array: Array<any> = [];
  public loading_cp_data: boolean = false;
  public token: TokenEntity;
  public base_data_token: Array<any> = [];
  
  constructor(private formBuilder: UntypedFormBuilder,private utilsService: UtilsService,private msg: NzMessageService, public peuService:PeuService,public spinner:NgxSpinnerService,private toastr: ToastrService,private cookieService: CookieService) {
    this.form_detail_peu = this.formBuilder.group({
      description: ['', [Validators.required]],
      date: ['', [Validators.required]],
      monto: ['', [Validators.required]],
      cp: ['', [Validators.required]],
      neighborhood: ['', [Validators.required]],
      extNumber: ['', [Validators.required]],
      state: ['', [Validators.required]],
      location: ['', [Validators.required]],
      intNumber: [''],
      municipality: ['', [Validators.required]],
      street: ['', [Validators.required]],
      references: [''],
    });
    this.token = new TokenEntity(this.cookieService);
  }
  
  ngOnInit(): void {
  }


  onCloseModal(): void {
    this.onCloseModalEvent.emit(false);
  }

  getCpData = (event: any): void => {
    let inputCp = event.target.value;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!isNaN(+inputCp) && reg.test(inputCp)) ||
      inputCp === '' ||
      inputCp === '-'
    ) {
      if (event.target.value.length == 5) {
        this.loading_cp_data = true;
        this.spinner.show();
        this.utilsService.getCpData(inputCp, (data) => {
          this.spinner.hide();
          if (data) {
            this.list_neighborhoods = data.neighborhoodList;
            this.form_detail_peu.controls['state'].setValue(data.state);
            this.form_detail_peu.controls['municipality'].setValue(data.municipality);
          }
          this.loading_cp_data = false;
        });
      }
    } else {
    }
  };

  

  public EventInputCurps(value: any): void {
    // MALV950825MGTRNR18
    // HEVD950613MGTRLN04


    if(value.length == 1){
      let res = value[0].replaceAll(" ","");
      const array_curps = res.match(/.{1,18}/g);
      this.tagValue = array_curps;
      this.validateCurpSex(array_curps);
    }
    else{
      this.validateCurpSex(value);
    }
  }
  
  public validateCurpSex(array_curps:Array<string>){
    this.showSpinner = true;
    this.actual_curp_woman = 0;
    this.actual_curp_men = 0;
    this.actual_curp_data_array = [];

    for(let curp of array_curps){
      this.utilsService.getCurpData(curp, data_response => {
        if(data_response) {
          this.showSpinner = true;
          this.actual_curp_data_array.push({
            uid:'',
            curp: data_response['curp'],
            nombreCompleto: data_response['nombre'] + ' ' + data_response['primerApellido'] + ' ' + data_response['segundoApellido'],
            fechaNacimientoDate: data_response['fechaNacimientoDate'],
            fechaNacimientoTexto: data_response['fechaNacimientoTexto'],
            genero: data_response['genero'],
            nacionalidad: data_response['nacionalidad'],
            edad: this.getActualAge(data_response['fechaNacimientoTexto'])
          });

          if(data_response['genero'] == 'FEMENINO'){
            this.actual_curp_woman = this.actual_curp_woman + 1;
          }
          if(data_response['genero'] == 'MASCULINO'){
            this.actual_curp_men = this.actual_curp_men + 1;
          }
        }
      });
    }
  }

  onChangeDatePicker(result: Date): void {
  }

  getActualAge(date_string:string):number {
    // Split date with this format y/m/d
    let arr_date = date_string.split('/');

    let new_date_string = arr_date[2] + '/' + arr_date[1] + '/' + arr_date[0];
    let today = new Date();
    let birthDate = new Date(new_date_string);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

  public addDetailData():void{
    this.spinner.show();

    if(this.tagValue.length >= 1){
      this.form_detail_peu.value['monto'] = this.form_detail_peu.value['monto'];
      this.form_detail_peu.value['description'] = this.form_detail_peu.value['description'];
      this.form_detail_peu.value['dependencia'] = this.modality_data['dependencia'];
      
      this.form_detail_peu.value['programa'] = {
        q: this.modality_data['programaClave'],
        modalidad: {
          nombre: this.modality_data['nombre'],
          clave: this.modality_data['clave']
        },
        tipoApoyo: {
          nombre: this.modality_data['apoyo']['nombre'],
          clave: this.modality_data['apoyo']['clave']
        },
      };

      this.form_detail_peu.value['beneficiarios'] = this.actual_curp_data_array;
      this.form_detail_peu.value['totalBeneficiarios'] = {
        hombres: this.actual_curp_men,
        mujeres: this.actual_curp_woman 
      };
  
      this.form_detail_peu.value['estatusActual'] = this.modality_data['habilitado'];
  
      let data = this.form_detail_peu.value;
      const data_parsed = JSON.stringify(data);
  
      this.peuService.addDetailPeu(data_parsed, (response:any) => {
        if(response === true){
          this.spinner.hide();
          this.toastr.success('Se agregó el detalle de forma correcta.');
          this.onCloseModalEvent.emit(false);
        }
      });
    }else{
      this.toastr.warning('Falta agregar beneficiarios');
    }
    
  }
}
