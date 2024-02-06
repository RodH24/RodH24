import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'card-q',
  templateUrl: './card-q.component.html',
  styleUrls: ['./card-q.component.scss']
})
export class CardQComponent implements OnInit {
  
  @Output() onSelectCard: EventEmitter<number> = new EventEmitter<number>();
  @Input() q_data!: any;

  constructor() { }

  ngOnInit(): void {
  }

  public showDetail(modality_data:any): void {
    this.onSelectCard.emit(modality_data);
  }
}
