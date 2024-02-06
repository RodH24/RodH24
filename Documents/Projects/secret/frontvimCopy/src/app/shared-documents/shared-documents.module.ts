import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
//
import { AcuseUploadComponent } from './components/acuse-upload/acuse-upload.component';
// import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { UploadStepperComponent } from './components/upload-stepper/upload-stepper.component';

@NgModule({
  declarations: [
    AcuseUploadComponent,
    // DocumentUploadComponent,
    UploadStepperComponent
  ],
  imports: [
    SharedModule,
    NgxDropzoneModule,
  ],
  exports: [
    AcuseUploadComponent,
    // DocumentUploadComponent,
    UploadStepperComponent
  ],
})
export class SharedDocumentsModule { }
