import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  WorkSituationList,
  EmploymentBenefitsList,
} from '@data/constants/cedula';
import {
  CurrencyFunctions,
  FormFunctions,
  SolicitudFunctions,
} from '@app/data/functions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-income-data',
  templateUrl: './step-income-data.component.html',
  styleUrls: ['./step-income-data.component.scss'],
})
export class StepIncomeDataComponent implements OnInit {
  public readonly workSituationList = WorkSituationList;
  public readonly employmentBenefitsList = EmploymentBenefitsList;
  //
  @Input() cedulaData: any = {};
  @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
  private subscriptionList: Array<any> = [];
  private readonly stepName: string = 'datosIngreso';

  //
  public formData: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder, private toastr: ToastrService) {
    this.formData = this.formBuilder.group({
      situacionEmpleo: this.formBuilder.group({
        codigo: [0, [Validators.required, Validators.min(1)]],
        descripcion: ['', [Validators.required]],
      }),
      prestacionesTrabajo: new UntypedFormArray(
        FormFunctions.fillFormArraySelectOptionType(
          this.formBuilder,
          this.employmentBenefitsList,
          this.employmentBenefitsList.length - 1
        )
      ),
      totalIngreso: ['', [Validators.required, Validators.min(0)]],
      totalPension: ['', [Validators.required, Validators.min(0)]],
      totalRemesa: ['', [Validators.required, Validators.min(0)]],
    });
  }

  get prestacionesTrabajo() {
    return this.formData.get('prestacionesTrabajo') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.subscriptionList = [
      ...FormFunctions.setSubscriptionSwitchOption(
        this,
        this.toastr,
        this.prestacionesTrabajo
      ),
      FormFunctions.setSelectSubscription(
        this.formData,
        'situacionEmpleo',
        this.workSituationList,
        ['descripcion']
      ),
      FormFunctions.setCurrencyInputSubscription(this.formData, 'totalIngreso'),
      FormFunctions.setCurrencyInputSubscription(this.formData, 'totalPension'),
      FormFunctions.setCurrencyInputSubscription(this.formData, 'totalRemesa'),
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
      if (item) item.unsubscribe();
    }
  }

  public onPreviousStepClick() {
    this.changeContent.emit(SolicitudFunctions.previousStep());
  }

  public onNextStepClick(): void {
    if (!FormFunctions.showFormErrors(this.formData)) return;

    this.changeContent.emit(
      SolicitudFunctions.nexStep(this.stepName, this.stepData)
    );
  }

  /***********************
   ****** AUXILIAR *******
   **********************/
  private get stepData(): any {
    const stepData = this.formData.value;

    stepData.totalIngreso = CurrencyFunctions.priceToNumber(
      this.formData.get('totalIngreso')?.value
    );
    stepData.totalPension = CurrencyFunctions.priceToNumber(
      this.formData.get('totalPension')?.value
    );
    stepData.totalRemesa = CurrencyFunctions.priceToNumber(
      this.formData.get('totalRemesa')?.value
    );

    return stepData;
  }
}
