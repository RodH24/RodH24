import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
//
import { DocumentsRoutingModule } from './documents-routing.module';
import { PrefolioComponent } from './views/prefolio/prefolio.component';
import { ReportsComponent } from './views/reports/reports.component';
import { SolicitudloteComponent } from './views/solicitudlote/solicitudlote.component';

@NgModule({
  declarations: [
    PrefolioComponent,
    ReportsComponent,
    SolicitudloteComponent,
  ],
  imports: [
    DocumentsRoutingModule,
    SharedModule,
  ],
})
export class DocumentsModule {}
