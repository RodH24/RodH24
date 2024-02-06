import { NgModule } from '@angular/core';
import { DependenciaDashboardComponent } from './views/dependency-dashboard/dependency-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DependenciaRoutingModule } from './dependency.routing';
import { ModalFichaCiudadanaComponent } from './components/modal-ficha-ciudadana/modal-ficha-ciudadana.component';
import { ApplicantDashboardComponent } from './components/applicant-dashboard/applicant-dashboard.component';
import { ModalVaidateApplicantComponent } from './components/modal-vaidate-applicant/modal-vaidate-applicant.component';
import { ModalDictaminateApplicantComponent } from './components/modal-dictaminate-applicant/modal-dictaminate-applicant.component';
import { ModalAproveApplicantComponent } from './components/modal-aprove-applicant/modal-aprove-applicant.component';
import { ModalRejectRequestComponent } from './components/modal-reject-request/modal-reject-request';
import { ModalCancelRequestComponent } from './components/modal-cancel-request/modal-cancel-request';
import { ModalDeliveredApplicantComponent } from './components/modal-delivered-applicant/modal-delivered-applicant.component';
import { ModalApprovedComponent } from './components/modal-approved/modal-approved.component';
import { ModalValidateChangeComponent } from './components/modal-validate-change/modal-validate-change.component';
import { ModalRejectedListComponent } from './components/modal-rejected-list/modal-rejected-list.component';
import { DocumentsPanelComponent } from './views/documents-panel/documents-panel.component';
import { DocumentsUpdateModalComponent } from './components/documents-update-modal/documents-update-modal.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ObservationDashboardComponent } from './views/observation-dashboard/observation-dashboard';
import { CancelationDashboardComponent } from './views/cancelation-dashboard/cancelation-dashboard';

@NgModule({
  declarations: [
    DependenciaDashboardComponent,
    ModalFichaCiudadanaComponent,
    ApplicantDashboardComponent,
    ModalVaidateApplicantComponent,
    ModalDictaminateApplicantComponent,
    ModalAproveApplicantComponent,
    ModalDeliveredApplicantComponent,
    ModalApprovedComponent,
    ModalValidateChangeComponent,
    ModalRejectedListComponent,
    ModalRejectRequestComponent,
    ModalCancelRequestComponent,
    DocumentsPanelComponent,
    DocumentsUpdateModalComponent,
    ObservationDashboardComponent,
    CancelationDashboardComponent
  ],
  imports: [DependenciaRoutingModule, SharedModule, NgxDropzoneModule]
})
export class DependencyModule {}
