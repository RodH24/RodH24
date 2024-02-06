import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeuDashboardComponent } from './views/peu-dashboard/peu-dashboard.component';
import { PeuDashboardDetailComponent } from './views/peu-dashboard-detail/peu-dashboard-detail.component';
import { SpecialPeuComponent } from './views/special-peu/special-peu.component';

const routes: Routes = [
  {
    path:'panel',
    component: PeuDashboardComponent
  },
  {
    path:'panel-detail',
    component: PeuDashboardDetailComponent
  },
  {
    path:'peu-especial',
    component: SpecialPeuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeuRoutingModule {}
