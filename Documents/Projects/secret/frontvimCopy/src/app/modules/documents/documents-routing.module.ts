import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrefolioComponent } from './views/prefolio/prefolio.component';
import { ReportsComponent } from './views/reports/reports.component';
import { SolicitudloteComponent } from './views/solicitudlote/solicitudlote.component';

const routes: Routes = [
    {
      path: 'reimprimir-solicitudes',
      component: SolicitudloteComponent
    },
    {
        path: 'reportes',
        component: ReportsComponent
    },
    {
      path: 'formatos/:type',
      component: PrefolioComponent
    },
    { path: '**', redirectTo: 'formatos', pathMatch: 'full' }
];

@NgModule({
    imports: [
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ]
})
export class DocumentsRoutingModule { }
