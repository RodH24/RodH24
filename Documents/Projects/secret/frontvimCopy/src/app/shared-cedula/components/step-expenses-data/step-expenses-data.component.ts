import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectOptionType } from '@data/types';
import {
  ExpensesQuestionList,
  FrequencyOptionsList,
} from '@data/constants/cedula';
import { CurrencyFunctions, FormFunctions, SolicitudFunctions } from '@app/data/functions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-expenses-data',
  templateUrl: './step-expenses-data.component.html',
  styleUrls: ['./step-expenses-data.component.scss'],
})
export class StepExpensesDataComponent implements OnInit {
  public readonly expensesQuestionList: Array<{
    title: string;
    formControlName: string;
  }> = ExpensesQuestionList;
  public readonly frequencyOptionsList: Array<SelectOptionType> =
    FrequencyOptionsList;
  /* Data restored from local storage in tue citizen-file-slider component. If empty the form shows the placeholders */
  @Input() cedulaData: any = {};
  /* Form data is emitted to the citizen-file-slider component when the next step event is triggered */
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private readonly stepName: string = 'datosGasto';
  private subscriptionList: Array<Subscription | void> = [];
  public formData: UntypedFormGroup;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular FormBuilder class
   */
  constructor(private formBuilder: UntypedFormBuilder) {
    /* Creates the form group fields from the questions list */
    this.formData = this.formBuilder.group(this.fillFormGroupByQuestionList());
    this.subscriptionList = this.setSubscription();
  }

  ngOnInit(): void {
    // Restore data from local storage
    if (
      this.cedulaData &&
      this.cedulaData[this.stepName] &&
      Object.keys(this.cedulaData[this.stepName]).length > 0
    ) {
      this.formData.patchValue(this.cedulaData[this.stepName]);
    }
  }

  ngOnDestroy() {
    for (const element of this.subscriptionList) {
      if (element) element.unsubscribe();
    }
  }

  public onPreviousStepClick() {
    this.changeContent.emit(SolicitudFunctions.previousStep());
  }

  public onNextStepClick(): void {
    if (!FormFunctions.showFormErrors(this.formData)) {
      return;
    }

    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.stepData)
    );
  }

  /**
   * Return an form group to control the form
   * @returns: { [key: string]: FormGroup } group: object with all keys on the list
   * @private
   */
  private fillFormGroupByQuestionList(): { [key: string]: UntypedFormGroup } {
    const group: any = {};
    for (const element of this.expensesQuestionList) {
      group[element.formControlName] = this.formBuilder.group({
        gasto: ['', [Validators.required, Validators.min(0)]],
        periodo: this.formBuilder.group({
          codigo: [0, [Validators.required, Validators.min(1)]],
          descripcion: ['', [Validators.required]],
        }),
      });
    }
    return group;
  }

  /**
   * Subscribe select options to update description on code change
   * @private
   */
  private setSubscription(): Array<Subscription | void> {
    const subscriptionList = [];
    for (const element of this.expensesQuestionList) {
      subscriptionList.push(
        FormFunctions.setSelectSubscription(
          this.formData,
          `${element.formControlName}.periodo`,
          this.frequencyOptionsList,
          ['descripcion']
        )
      );
      subscriptionList.push(
        FormFunctions.setCurrencyInputSubscription(
          this.formData,
          `${element.formControlName}.gasto`
        )
      );
    }
    return subscriptionList;
  }

  private get stepData(): any {
    const stepData = this.formData.value;
    for(const key in stepData) {
      stepData[key].gasto = CurrencyFunctions.priceToNumber(
        this.formData.get(`${key}.gasto`)?.value
      );
    }
    return stepData;
  }
}
