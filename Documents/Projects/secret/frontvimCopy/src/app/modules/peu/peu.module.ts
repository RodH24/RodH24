import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PeuRoutingModule } from './peu.routing';
import { CardQComponent } from './components/card-q/card-q.component';
import { AddDetailsComponent } from './components/add-details/add-details.component';
import { DetailsModalComponent } from './components/details-modal/details-modal.component';
import { PeuDashboardComponent } from './views/peu-dashboard/peu-dashboard.component';
import { PeuDashboardDetailComponent } from './views/peu-dashboard-detail/peu-dashboard-detail.component';
import { SpecialPeuComponent } from './views/special-peu/special-peu.component';

@NgModule({
  declarations: [
    PeuDashboardComponent,
    CardQComponent,
    PeuDashboardDetailComponent,
    AddDetailsComponent,
    CardQComponent,
    DetailsModalComponent,
    AddDetailsComponent,
    SpecialPeuComponent
  ],
  imports: [ 
    PeuRoutingModule, 
    SharedModule 
  ]
})

export class PeuModule {}
