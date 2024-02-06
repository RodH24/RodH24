import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HealthServiceList, ChronicDiseasesList } from '@data/constants/cedula';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FormFunctions } from '@app/data/functions';

/**
 * Class representing the health service data step of Cedula Ciudadana stepper
 */
@Component({
  selector: 'app-step-health-service-data',
  templateUrl: './step-health-service-data.component.html',
  styleUrls: ['./step-health-service-data.component.scss'],
})
export class StepHealthServiceDataComponent implements OnInit {
  private readonly healthServiceList: Array<any> = HealthServiceList;
  private readonly chronicDiseasesList: Array<any> = ChronicDiseasesList;
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  /* Form data is emitted to the citizen-file-slider component when the next step event is triggered */
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private subscriptionList: Array<any> = [];
  private stepName: string = 'datosSalud';
  public formData: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
    this.formData = this.formBuilder.group({
      limitacionMental: false,
      servicioMedico: new UntypedFormArray(
        FormFunctions.fillFormArraySelectOptionType(
          this.formBuilder,
          this.healthServiceList,
          this.healthServiceList.length - 1
        )
      ),
      enfermedadCronica: new UntypedFormArray(
        FormFunctions.fillFormArraySelectOptionType(
          this.formBuilder,
          this.chronicDiseasesList,
          this.chronicDiseasesList.length - 1
        )
      ),
    });
  }

  get servicioMedico() {
    return this.formData.get('servicioMedico') as UntypedFormArray;
  }

  get enfermedadCronica() {
    return this.formData.get('enfermedadCronica') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.subscriptionList = [
      ...FormFunctions.setSubscriptionSwitchOption(
        this,
        this.toastr,
        this.servicioMedico
      ),
      ...FormFunctions.setSubscriptionSwitchOption(
        this,
        this.toastr,
        this.enfermedadCronica
      ),
    ];

    // Restore data from local storage
    if (
      this.cedulaData &&
      this.cedulaData[this.stepName] &&
      Object.keys(this.cedulaData[this.stepName]).length > 0
    ) {
      this.formData.setValue(this.cedulaData[this.stepName]);
    }
  }

  ngOnDestroy() {
    for (const item of this.subscriptionList) {
      item.unsubscribe();
    }
  }

  /**
   * Control the stepper on previous step action
   * @public
   */
  onPreviousStepClick(): void {
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
