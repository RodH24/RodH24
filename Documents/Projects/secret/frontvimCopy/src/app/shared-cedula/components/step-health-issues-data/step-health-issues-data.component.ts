import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormFunctions } from '@app/data/functions';
import { SliderMarks, HealthIssuesQuestionList } from '@data/constants/cedula';

@Component({
  selector: 'app-step-health-issues-data',
  templateUrl: './step-health-issues-data.component.html',
  styleUrls: ['./step-health-issues-data.component.scss'],
})
export class StepHealthIssuesDataComponent implements OnInit {
  public readonly sliderMarks: any = SliderMarks;
  public readonly healthIssuesQuestionList: Array<any> =
    HealthIssuesQuestionList;
  //
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  /* Form data is emitted to the citizen-file-slider component when the next step event is triggered */
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'discapacidad';
  public formData: UntypedFormGroup;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular FormBuilder class
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    /* Creates the form group fields from the questions list */
    this.formData = this.formBuilder.group(
      FormFunctions.formGroupFieldsOnlyRequired(
        this.healthIssuesQuestionList.map((element) => element.key),
        1
      )
    );
  }

  ngOnInit(): void {
    // Restore data from local storage
    if (
      this.cedulaData &&
      this.cedulaData[this.stepName] &&
      Object.keys(this.cedulaData[this.stepName]).length > 0
    ) {
      this.formData.setValue(this.cedulaData[this.stepName]);
    }
  }

  /**
   * Control the stepper on previous step action
   * @public
   */
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

  /**
   * Control the stepper on next step action, emit the form data to the citizen-file-slider component
   * @public
   */
  public onNextStepClick(): void {
    this.changeContent.emit({
      isNext: true,
      step_action: 1,
      data: {
        name: this.stepName,
        value: this.formData.value,
      },
    });
  }
}
