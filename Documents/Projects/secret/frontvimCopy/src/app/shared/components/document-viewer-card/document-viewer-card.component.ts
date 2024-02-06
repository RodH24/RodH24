import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Component that defines the applicant card to show on dashboard
 */
@Component({
  selector: 'document-viewer-card',
  templateUrl: './document-viewer-card.component.html',
  styleUrls: ['./document-viewer-card.component.scss'],
})
export class DocumentViewerCardComponent implements OnInit {
  /** Card data to fill the component */
  @Input() cardData:any;
  /** Show modal, event emitter */
  @Output() detailsButtonClickEvent = new EventEmitter<any>();
  // Push or delete the folio on the array to make the actions 
  @Output() ActionsOnFolioEvent = new EventEmitter<{control:boolean, estatus:string, data:string}>(); 

  public checked:boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  /**
   * Emit the event to parent component to open the modal
   * @param data
   */
   onDetailsClick(card_data: any): void {
    this.detailsButtonClickEvent.emit(card_data);
  }

  public selectEventCard(folio:string,estatus:string){
    this.ActionsOnFolioEvent.emit({
      control:this.checked,
      estatus:estatus,
      data: folio
    });
   
  }
}
