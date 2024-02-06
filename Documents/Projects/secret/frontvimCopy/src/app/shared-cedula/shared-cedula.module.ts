import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SharedDocumentsModule } from '@app/shared-documents/shared-documents.module';
//
import { CedulaComponent } from './components/cedula/cedula.component';
import { StepHouseholdDataComponent } from './components/step-household-data/step-household-data.component';
import { StepHealthServiceDataComponent } from './components/step-health-service-data/step-health-service-data.component';
import { StepHealthIssuesDataComponent } from './components/step-health-issues-data/step-health-issues-data.component';
import { StepEducationDataComponent } from './components/step-education-data/step-education-data.component';
import { StepIncomeDataComponent } from './components/step-income-data/step-income-data.component';
import { StepExpensesDataComponent } from './components/step-expenses-data/step-expenses-data.component';
import { StepFoodDataComponent } from './components/step-food-data/step-food-data.component';
import { StepHousingDataComponent } from './components/step-housing-data/step-housing-data.component';
import { StepHouseAppliancesDataComponent } from './components/step-house-appliances-data/step-house-appliances-data.component';
import { StepPerceptionDataComponent } from './components/step-perception-data/step-perception-data.component';

@NgModule({
  imports: [SharedModule, SharedDocumentsModule],
  declarations: [
    CedulaComponent,
    StepHouseholdDataComponent,
    StepHealthServiceDataComponent,
    StepHealthIssuesDataComponent,
    StepEducationDataComponent,
    StepIncomeDataComponent,
    StepExpensesDataComponent,
    StepFoodDataComponent,
    StepHousingDataComponent,
    StepHouseAppliancesDataComponent,
    StepPerceptionDataComponent,
  ],
  exports: [
    CedulaComponent,
    StepHouseholdDataComponent,
    StepHealthServiceDataComponent,
    StepHealthIssuesDataComponent,
    StepEducationDataComponent,
    StepIncomeDataComponent,
    StepExpensesDataComponent,
    StepFoodDataComponent,
    StepHousingDataComponent,
    StepHouseAppliancesDataComponent,
    StepPerceptionDataComponent,
  ],
})
export class SharedCedulaModule {}
