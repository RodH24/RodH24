import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FeedingQuestionList } from '@app/data/constants/cedula';
import { FormFunctions } from '@data/functions';

@Component({
  selector: 'app-step-food-data',
  templateUrl: './step-food-data.component.html',
  styleUrls: ['./step-food-data.component.scss'],
})
export class StepFoodDataComponent implements OnInit {
  public readonly feedingQuestionList: Array<{
    title: string;
    formControlName: string;
  }> = FeedingQuestionList;
  //
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  /* Form data is emitted to the citizen-file-slider component when the next step event is triggered */
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'datosAlimentacion';
  public formData: UntypedFormGroup;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular FormBuilder class
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    /* Creates the form group fields from the questions list */
    this.formData = this.formBuilder.group(
      FormFunctions.formGroupFieldsOnlyRequired(
        this.feedingQuestionList.map((element) => element.formControlName),
        false
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
