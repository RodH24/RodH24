import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.component.html',
  styleUrls: ['./yes-no-modal.component.scss']
})
export class YesNoModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() yes: string = 'Sí';
  @Input() no: string = 'No'
  @Output() isAccept = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  public onClick(option: boolean) {
    this.isAccept.emit(option);
  }
}
