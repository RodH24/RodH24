import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'card-modality',
  templateUrl: './card-modality.component.html',
  styleUrls: ['./card-modality.component.scss']
})
export class CardModalityComponent implements OnInit {

  @Output() onSelectCard: EventEmitter<number> = new EventEmitter<number>();
  @Input() q_data!: any;

  constructor() { }

  ngOnInit(): void {
  }

  public showDetail(modality_data:any): void {
    this.onSelectCard.emit(modality_data);
  }

}
