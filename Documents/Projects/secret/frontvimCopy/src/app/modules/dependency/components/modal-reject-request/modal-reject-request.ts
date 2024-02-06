import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import { TrackingFlowService } from '@data/services';
import decode from 'jwt-decode';

@Component({
  selector: 'modal-reject-request',
  templateUrl: './modal-reject-request.html',
  styleUrls: ['./modal-reject-request.scss']
})
export class ModalRejectRequestComponent implements OnInit {

  @Input() modalData: any;
  @Input() isOpenModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{event:boolean,modalName:string}>();
  public formData: UntypedFormGroup;
  public token: TokenEntity;
  public reject_list: Array<any> = [];
  public reject:Boolean = false;


  constructor(private formBuilder: UntypedFormBuilder, private toastr: ToastrService, private trackingFlowService: TrackingFlowService, public spinner: NgxSpinnerService, private cookieService: CookieService) {

    this.token = new TokenEntity(this.cookieService);

    this.formData = this.formBuilder.group({
      select_reason: ['', [Validators.required]],
      text_reason: [''],
    });

  }

  ngOnInit(): void {
      this.getInitialData();
  }

  public interactRejectModal = () => {
    this.isOpenModal = !this.isOpenModal;
  }
  
  public getInitialData = () => {
    this.trackingFlowService.getRejectList().subscribe(
      (success: any) => {
        this.reject_list = success.result;
      },
      (error: any) => {
        this.toastr.error('Hubo un error al obtener los catalogos: ', error);
      }
    );
  }

  public getUsrData = (): any => {
    let token: any = decode(this.token.value);

    let usuarioCaptura = {
      id: token.uid,
      nombre: token.name,
      email: token.email,
      codigoRol: token.roleCode,
      rol: token.roleName,
    };

    return usuarioCaptura;
  }

  public rejectApplication = () => {
    this.spinner.show();

    let usr_data = this.getUsrData();

    let actual_state = {
      codigo: this.modalData.estatusActual.codigo,
      descripcion: this.modalData.estatusActual.descripcion,
    };

    let body = {
      form_data: this.formData.value,
      usr_data: usr_data,
      actual_state: actual_state,
      folio: this.modalData.folio,
    };

    let body_stringify = JSON.stringify(body);

    this.trackingFlowService.rejectApplication(body_stringify).subscribe(
      (success: any) => {
        this.spinner.hide();
        this.toastr.success('Se rechazó la solicitud exitosamente');
        this.interactRejectModal();
        this.onHideModalClick();
      },
      (error: any) => {
        this.toastr.error('Hubo un error al rechazar la solicitud: ', error);
        this.spinner.hide();
      }
    );
  }

  public onHideModalClick(): void {
    this.closeModalEvent.emit('hideRejectModal');
  }

  public validateLength(event:any):void {
    if(event === '' || this.formData.value.select_reason === ''){
    this.reject = !this.reject;
      this.toastr.warning('Para rechazar la solicitud por favor ingrese una descripción y seleccione una opción.');
    }else{
    this.reject = true;
    }
  }
}