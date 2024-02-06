import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TokenEntity } from '@data/entities';
import { TrackingFlowService } from '@data/services';1
@Component({
  selector: 'modal-rejected-list',
  templateUrl: './modal-rejected-list.component.html',
  styleUrls: ['./modal-rejected-list.component.scss']
})
export class ModalRejectedListComponent implements OnInit {
  @Input() modalData: any;
  @Input() selectedKpi: string = '';
  @Input() configSelected: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() applicationUpdateEvent = new EventEmitter<{ event: boolean, modalName: string }>();
  public modal_title:string = 'Historial de solicitudes';
  public status_log_list:Array<any> = [];
  public historical_data:Array<any> = [{}];

  constructor(
    private toastr: ToastrService,
    public spinner:NgxSpinnerService,
    private cookieService: CookieService,
    private trackingFlowService: TrackingFlowService
    ) {
  }

  ngOnInit(): void {
    this.getStatusLogList();
  }

  public getStatusLogList = () =>{
    let folio = this.modalData['folio'];

    this.trackingFlowService.ListStatusLogByFolio(folio).subscribe((success:any)=>{
      this.status_log_list = success['result'][0]['estatusLog'];
    },(error:any)=>{
      this.toastr.error('Hubo un error al obtener la informacion: ', error)
    });
  }

  public onHideModalClick(): void {
    this.closeModalEvent.emit(this.selectedKpi);
  }
}
