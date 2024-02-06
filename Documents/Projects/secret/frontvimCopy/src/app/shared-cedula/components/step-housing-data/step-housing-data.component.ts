import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HousingQuestionList } from '@app/data/constants/cedula';
import { FormFunctions, SolicitudFunctions } from '@app/data/functions';

@Component({
  selector: 'app-step-housing-data',
  templateUrl: './step-housing-data.component.html',
  styleUrls: ['./step-housing-data.component.scss'],
})
export class StepHousingDataComponent implements OnInit {
  public readonly selectQuestionsList: Array<any> = HousingQuestionList;
  //
  @Input() cedulaData: any = {};
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'datosVivienda';
  public formData: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.formData = this.formBuilder.group({
      ...this.fillFormGroupByQuestionList(),
      numeroCuartos: [0, [Validators.required]],
      numeroPersonaHabitantes: [0, [Validators.required]],
    });
    this.setSubscription();
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

  public questionLength(list: Array<any>) {
    return list.length;
  }

  public onUpdateCount(count: number, key: string): void {
    this.formData.controls[key].setValue(count);
  }

  public onPreviousStep() {
    this.changeContent.emit(SolicitudFunctions.previousStep());

  }

  public onNextStep(): void {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }
    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.formData.getRawValue())
    );
  }

  /**
   * Return an form group to control the form
   * @returns: { [key: string]: FormGroup } group: object with all keys on the list
   * @private
   */
  private fillFormGroupByQuestionList(): { [key: string]: UntypedFormGroup } {
    const group: any = {};
    for (const element of this.selectQuestionsList) {
      group[element.formControlName] = this.formBuilder.group({
        codigo: [0, [Validators.required, Validators.min(1)]],
        descripcion: ['', [Validators.required]],
      });
    }
    return group;
  }

  /**
   * Subscribe select options to update description on code change
   * @private
   */
  private setSubscription(): void {
    for (const element of this.selectQuestionsList) {
      FormFunctions.setSelectSubscription(
        this.formData,
        `${element.formControlName}`,
        element.options,
        ['descripcion']
      );
    }
  }
}
