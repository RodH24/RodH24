import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-step-perception-data',
  templateUrl: './step-perception-data.component.html',
  styleUrls: ['./step-perception-data.component.scss'],
})
export class StepPerceptionDataComponent implements OnInit {
  @Input() cedulaData: any = {};
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'percepcionSeguridad';
  public perception: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Restore data from local storage
    if (
      this.cedulaData &&
      this.stepName in this.cedulaData
    ) {
      this.perception = this.cedulaData[this.stepName];
    }
  }

  public onPreviousStepClick() {
    this.changeContent.emit({
      isNext: false,
      step_action: -1,
      data: {
        name: '',
        value: '',
      },
    });
  }

  public onNextStepClick(): void {
    this.changeContent.emit({
      isNext: true,
      step_action: -1,
      data: {
        name: this.stepName,
        value: this.perception,
      },
    });
  }
}
