import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DependenciaDashboardComponent } from './views/dependency-dashboard/dependency-dashboard.component';
import { DocumentsPanelComponent } from './views/documents-panel/documents-panel.component';
import { ObservationDashboardComponent } from './views/observation-dashboard/observation-dashboard';
import { CancelationDashboardComponent } from './views/cancelation-dashboard/cancelation-dashboard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel/pendientes',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    redirectTo: 'panel/pendientes',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    children: [
      {
        path: 'aprobadas',
        component: DependenciaDashboardComponent,
      },
      {
        path: 'pendientes',
        component: DependenciaDashboardComponent,
      },
      {
        path: 'documentos',
        component: DocumentsPanelComponent
      },
      {
        path: 'en-observacion',
        component: ObservationDashboardComponent
      },
      {
        path: 'canceladas',
        component: CancelationDashboardComponent
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DependenciaRoutingModule {}
