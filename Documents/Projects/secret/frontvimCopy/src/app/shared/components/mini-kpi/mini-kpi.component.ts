import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MiniKpiClassType } from '@data/types/MiniKpi';

@Component({
  selector: 'app-mini-kpi',
  templateUrl: './mini-kpi.component.html',
  styleUrls: ['./mini-kpi.component.scss']
})
export class MiniKpiComponent implements OnInit {
  @Output() typeOutput: EventEmitter<string> = new EventEmitter<string>();
  @Input() kpiData: MiniKpiClassType = {
    count: 0,
    title: '',
    class: 'string',
    isActive: false,
    type: '',
    color: 'seconday'
  };

  constructor() { }

  ngOnInit(): void {
  }

  public onStatusClick(): void {
    this.typeOutput.emit(this.kpiData.type);
  }

  public selectedClass(): string {
    return this.kpiData?.isActive ? `active` : '';
  }
}
