import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import decode from 'jwt-decode';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'modal-validate-change',
  templateUrl: './modal-validate-change.component.html',
  styleUrls: ['./modal-validate-change.component.scss'],
})
export class ModalValidateChangeComponent implements OnInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();
  @Input() base_list_folios: any;
  @Input() entered_list_folios: any;
  @Input() current_status!: string;

  public token: TokenEntity;
  public modal_title: string = '';
  public reject_list: Array<any> = [];
  public show_reject_modal: boolean = false;


  public actualData: Array<{ folio: string; class: string }> = [];
  public valid_folios: Array<{ folio: string; class: string }> = [];

  public button_title: string = '';
  public status_list: Array<any> = [];
  public current_status_text: string = '';

  public formData: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private modal: NzModalService
  ) {
    this.token = new TokenEntity(this.cookieService);

    this.formData = this.formBuilder.group({
      select_reason: ['', [Validators.required]],
      text_reason: [''],
    });
  }

  ngOnInit(): void {
    this.validateFolios(this.base_list_folios, this.entered_list_folios);
    this.defineModalTitle();
    this.getStatusCatalogue();
    this.getInitialData();
  }

  public getInitialData = () => {
   
  }
  
  public getStatusCatalogue = () => {
  
  };

  public defineModalTitle = () => {
    let actual_status = this.current_status;

    if (actual_status === 'Validada') {
      this.modal_title = 'Dictaminar folios';
      this.button_title = 'Dictaminar';
      this.current_status_text = 'dictaminar';
    }

    if (actual_status === 'Dictaminacion') {
      this.modal_title = 'Aprobar folios';
      this.button_title = 'Aprobar';
      this.current_status_text = 'aprobar';
    }

    if (actual_status === 'Aprobada') {
      this.modal_title = 'Entregar folios';
      this.button_title = 'Entregar';
      this.current_status_text = 'entregar';
    }
  };

  public validateFolios = (
    existing_folios: Array<string>,
    entered_folios: Array<string>
  ) => {
    // cicles the receibed folios and check if the value exists on the actual data
    entered_folios.forEach((entered_folio: string) => {
      let exist = existing_folios.includes(entered_folio);

      if (exist === true) {
        this.actualData.push({
          folio: entered_folio,
          class: 'exists',
        });
        this.valid_folios.push({
          folio: entered_folio,
          class: 'exists',
        });
      } else {
        this.actualData.push({
          folio: entered_folio,
          class: 'doesnt_exists',
        });
      }
    });
  };

  public getUsrData = (): any => {
    let token: any = decode(this.token.value);

    let usuarioCaptura = {
      id: token['uid'],
      nombre: token['name'],
      email: token['email'],
      codigoRol: token['roleCode'],
      rol: token['roleName'],
    };

    return usuarioCaptura;
  };

  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }

  public interactRejectModal = () => {
    this.show_reject_modal = !this.show_reject_modal;
  
  }

  public getObjectDataActualStatus = (): any => {
    // Check on the catalogue and find the data
    for (let status of this.status_list) {
      if (status.descripcion === this.current_status) {
        return {
          codigo: status.codigo,
          descripcion: status.descripcion,
        };
      }
    }
  };

  public findNextStatus = (): any => {
    // Validada -> En Dictaminacion
    // En Dictaminacion -> Aprobada
    // Aprobada -> Entregada
    for (let status of this.status_list) {
      if (status.descripcion === this.current_status) {
        let actual_state = {
          codigo: status.codigo,
          descripcion: status.descripcion,
        };

        if (actual_state.descripcion === 'Validada') {
          // search for the nex status
          for (let next of this.status_list) {
            if (next.descripcion === 'Dictaminacion') {
              return {
                codigo: next.codigo,
                descripcion: next.descripcion,
              };
            }
          }
        }

        if (actual_state.descripcion === 'Dictaminacion') {
          // search for the nex status
          for (let next of this.status_list) {
            if (next.descripcion === 'Aprobada') {
              return {
                codigo: next.codigo,
                descripcion: next.descripcion,
              };
            }
          }
        }

        if (actual_state.descripcion === 'Aprobada') {
          // search for the nex status
          for (let next of this.status_list) {
            if (next.descripcion === 'Entregada') {
              return {
                codigo: next.codigo,
                descripcion: next.descripcion,
              };
            }
          }
        }
      }
    }
  };

  public interactWithData = () => {
    this.modal.confirm({
      nzTitle:
        '<p class="title-confirmation-modal">Deseo cambiar el estatus de estos folios</p>',
      nzContent:
        'Comprendo las implicaciones que tiene este proceso y deseo realizar el cambio.',
      nzWidth: '50%',
      nzOnOk: () => {
        this.spinner.show();
        let usr_data = this.getUsrData();
        let actual_state = this.getObjectDataActualStatus();
        let next_state = this.findNextStatus();

        let body = {
          usr_data: usr_data,
          actual_state: actual_state,
          next_state: next_state,
          arr_folios: this.valid_folios,
        };
        let body_stringify = JSON.stringify(body);
      },
    });
  };

  public rejectApplication = () => {
    this.spinner.show();

    // #1 - Values of the folios to update
    let converted_folios: Array<any> = [];

    this.valid_folios.forEach((value) => {
      converted_folios.push(value.folio);
    });

    // #2 - Get data of the current status
    let actual_state = this.getObjectDataActualStatus();
    // #3 - Get data of the current status
    let usr_data = this.getUsrData();

    let body = {
      form_data: this.formData.value,
      usr_data: usr_data,
      actual_state: actual_state,
      list_folio: converted_folios,
    };

    let body_stringify = JSON.stringify(body);

  };
}
