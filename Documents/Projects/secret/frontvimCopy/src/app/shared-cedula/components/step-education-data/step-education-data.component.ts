import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EducationLevelList, EducationYearsList } from '@data/constants/cedula';
import { FormFunctions, SolicitudFunctions } from '@app/data/functions';

@Component({
  selector: 'app-step-education-data',
  templateUrl: './step-education-data.component.html',
  styleUrls: ['./step-education-data.component.scss'],
})
export class StepEducationDataComponent implements OnInit {
  public readonly educationLevelList = EducationLevelList;
  public readonly educationYearsList = EducationYearsList;
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  /* Form data is emitted to the citizen-file-slider component when the next step event is triggered */
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();

  private readonly stepName: string = 'datosEducacion';
  public formData: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.formData = this.formBuilder.group({
      estudiante: [false, [Validators.required]],
      ultimoNivel: this.formBuilder.group({
        codigo: [0, [Validators.required, Validators.min(1)]],
        descripcion: ['', [Validators.required]],
      }),
      grado: this.formBuilder.group({
        codigo: [-1, [Validators.required, Validators.min(0)]],
        descripcion: ['', [Validators.required]],
      }),
    });
  }

  ngOnInit(): void {
    FormFunctions.setSelectSubscription(
      this.formData,
      'ultimoNivel',
      this.educationLevelList,
      ['descripcion']
    );
    FormFunctions.setSelectSubscription(
      this.formData,
      'grado',
      this.educationYearsList,
      ['descripcion']
    );
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
    // if(SolicitudFunctions.nexStep)
    if(!FormFunctions.showFormErrors(this.formData)) return;

    
    this.changeContent.emit(SolicitudFunctions.nexStep(this.stepName, this.formData.value));
  }
}
