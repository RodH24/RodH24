import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationStorageEntity } from '@app/data/entities';
import { RedirectionFunctions } from '@app/data/functions';
import { ProgramService } from '@app/data/services';
import { SessionEntity } from '@app/data/entities';

/**
 * Component that defines the applicant card to show on dashboard
 */
@Component({
  selector: 'app-applicant-card',
  templateUrl: './applicant-card.component.html',
  styleUrls: ['./applicant-card.component.scss'],
})
export class ApplicantCardComponent implements OnInit {
  @Input() cardData:any;
  @Output() detailsButtonClickEvent = new EventEmitter<any>();
  private applicationStorageEntity: ApplicationStorageEntity = new ApplicationStorageEntity();
  public checked:boolean = false;
  public session: any;
  public permissions: any;

  constructor(private router: Router, private programService: ProgramService) {
    this.session=new SessionEntity();
  }

  ngOnInit(): void {
    this.permissions = this.session.permissionsList;
    this.applicationStorageEntity.clearAll();
  }

  /**
   * Emit the event to parent component to open the modal
   * @param data
   */
   onDetailsClick(data: any): void {
    this.detailsButtonClickEvent.emit(data);
  }

  public onEditClick(){
    this.programService.get(
      null,
      this.cardData.programa.q,
      this.cardData.programa.modalidad.clave,
      this.cardData.programa.modalidad.tipoApoyo.clave,
      null,
      data => {
        this.applicationStorageEntity.program = data ?? null;
        if(data) {
          RedirectionFunctions.redirectToEditSolicitud(this.router, this.cardData.folio);
        }
    });
  }
}
