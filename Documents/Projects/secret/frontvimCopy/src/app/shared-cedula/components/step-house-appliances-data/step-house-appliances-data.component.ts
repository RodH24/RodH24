import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { HouseAppliancesList } from '@app/data/constants/cedula';
import { FormFunctions } from '@data/functions';

@Component({
  selector: 'app-step-house-appliances-data',
  templateUrl: './step-house-appliances-data.component.html',
  styleUrls: ['./step-house-appliances-data.component.scss'],
})
export class StepHouseAppliancesDataComponent implements OnInit {
  public readonly houseAppliancesList: Array<{
    title: string;
    formControlName: string;
  }> = HouseAppliancesList;
  //
  @Input() cedulaData: any = {};
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'datosEnseres';
  public formData: UntypedFormGroup;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular FormBuilder class
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    this.formData = this.formBuilder.group(
      FormFunctions.formGroupFieldsOnlyRequired(
        this.houseAppliancesList.map((element) => element.formControlName),
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
      step_action: 1,
      data: {
        name: this.stepName,
        value: this.formData.value,
      },
    });
  }
}
