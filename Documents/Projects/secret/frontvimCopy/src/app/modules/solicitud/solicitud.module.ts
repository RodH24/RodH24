import { NgModule } from '@angular/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from '@shared/shared.module';
import { SharedCedulaModule } from '@app/shared-cedula/shared-cedula.module';
import { SharedDocumentsModule } from '@app/shared-documents/shared-documents.module';
//
import { SolicitudRoutingModule } from './solicitud.routing';
import { SolicitudesComponent } from './views/solicitudes/solicitudes.component';
import { RegistroSolicitudesComponent } from './views/registro-solicitudes/registro-solicitudes.component';
import { CurpInputComponent } from './components/curp-input/curp-input.component';
// Solicitud
import { ValidateCurpDataComponent } from './components/validate-curp-data/validate-curp-data.component';
import { ContactDataFormComponent } from './components/contact-data-form/contact-data-form.component';
import { FirstFilesUploadComponent } from './components/first-files-upload/first-files-upload.component';
import { TutorDataFormComponent } from './components/tutor-data-form/tutor-data-form.component';
import { CurpSecondGroupDataFormComponent } from './components/curp-second-group-data-form/curp-second-group-data-form.component';
import { ComplementaryFilesUploadComponent } from './components/complementary-files-upload/complementary-files-upload.component';
import { ModalConfirmAdressComponent } from './components/modal-confirm-adress/modal-confirm-adress.component';
import { AdditionalDataComponent } from './components/additional-data/additional-data.component';

@NgModule({
  declarations: [
    SolicitudesComponent,
    RegistroSolicitudesComponent,
    CurpInputComponent,
    ValidateCurpDataComponent,
    ContactDataFormComponent,
    FirstFilesUploadComponent,
    TutorDataFormComponent,
    CurpSecondGroupDataFormComponent,
    ComplementaryFilesUploadComponent,
    ModalConfirmAdressComponent,
    AdditionalDataComponent
  ],
  imports: [
    SolicitudRoutingModule,
    SharedModule,
    SharedCedulaModule,
    SharedDocumentsModule,
    NgxDropzoneModule,
  ],
})
export class SolicitudModule {}
