import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

type OptionType = {
  value: string,
  title: string
}

@Component({
  selector: 'app-status-filter-pills',
  templateUrl: './status-filter-pills.component.html',
  styleUrls: ['./status-filter-pills.component.scss']
})
export class StatusFilterPillsComponent implements OnInit {
  @Input() title: string = '';
  @Input() options: Array<OptionType> = [];
  @Input() selectedOpt: string = '';
  @Output() onSelectedOpt: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  public onSelectedOptChange(): void {
    this.onSelectedOpt.emit(this.selectedOpt);
  }

}
