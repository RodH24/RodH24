// Angular 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Installed modules 
import { NgZorroModule } from './ng-zorro.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
// Custom components
import { MiniKpiComponent } from '@shared/components/mini-kpi/mini-kpi.component';
import { ContadorNumeroComponent } from '@shared/components/contador-numero/contador-numero.component';
import { DocumentViewerCardComponent } from './components/document-viewer-card/document-viewer-card.component';
import { DocumentUploadComponent } from '../shared-documents/components/document-upload/document-upload.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { YesNoModalComponent } from '@shared/components/yes-no-modal/yes-no-modal.component';
import { SectionsHeaderComponent } from './components/sections-header/sections-header.component';
import { DebounceFilterInputComponent } from './components/debounce-filter-input/debounce-filter-input.component';
import { StatusFilterPillsComponent } from './components/status-filter-pills/status-filter-pills.component';
import { ApplicantCardComponent } from './components/applicant-card/applicant-card.component';

// Pipes
import {
  ConcatenarAniosPipe,
  StatusBadgePipe,
  MapKeyValuePipe,
  MoneyMillionPipe,
  BadgeWeighingPipe,
  TrimKpiClassPipe,
  StringToArrayByComasPipe,
  ConvertIsoToStringDatePipe,
  ValidateRejectStatusPipe,
  ShowModalityNamePipe,
  addPeoplePipe,
  validateImpulseZonePipe,
  FormatNameWithoutRolPipe,
  ReorderObservationsPipe,
  FormatIndicatorKpiNumberPipe,
  NotEmptyTextPipe,
  CustomFilterPipe
} from '@core/pipes';
// Installed pipes 
import { SafePipeModule } from 'safe-pipe';
import { DynamicFormSelectComponent } from './components/dynamic-form-select/dynamic-form-select.component';
import { ApoyosSelectComponent } from './components/apoyos-select/apoyos-select.component';
// Custom pipes

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SafePipeModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    NgZorroModule,
    NgxPaginationModule
  ],
  declarations: [
    // Custom components 
    MiniKpiComponent,
    DocumentViewerCardComponent,
    DocumentUploadComponent,
    FooterComponent,
    HeaderComponent,
    YesNoModalComponent,
    ApplicantCardComponent,
    ContadorNumeroComponent,
    //ScrollProgressBarComponent,
    // pipes
    ShowModalityNamePipe,
    // Custom pipes
    ConcatenarAniosPipe,
    StatusBadgePipe,
    MapKeyValuePipe,
    MoneyMillionPipe,
    BadgeWeighingPipe,
    TrimKpiClassPipe,
    StringToArrayByComasPipe,
    ConvertIsoToStringDatePipe,
    ValidateRejectStatusPipe,
    ShowModalityNamePipe,
    NotEmptyTextPipe,
    CustomFilterPipe,
    addPeoplePipe,
    validateImpulseZonePipe,
    FormatNameWithoutRolPipe,
    ReorderObservationsPipe,
    FormatIndicatorKpiNumberPipe,
    SectionsHeaderComponent,
    DebounceFilterInputComponent,
    StatusFilterPillsComponent,
    DynamicFormSelectComponent,
    ApoyosSelectComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    NgxPaginationModule,
    //Custom components
    MiniKpiComponent,
    DocumentViewerCardComponent,
    DocumentUploadComponent,
    FooterComponent,
    HeaderComponent,
    YesNoModalComponent,
    ApplicantCardComponent,
    ContadorNumeroComponent,
    DynamicFormSelectComponent,
    ApoyosSelectComponent,
    //ScrollProgressBarComponent,
    // Installed pipes
    SafePipeModule,
    // Custom pipes 
    ConcatenarAniosPipe,
    StatusBadgePipe,
    MapKeyValuePipe,
    MoneyMillionPipe,
    BadgeWeighingPipe,
    TrimKpiClassPipe,
    StringToArrayByComasPipe,
    NotEmptyTextPipe,
    CustomFilterPipe,
    ConvertIsoToStringDatePipe,
    ValidateRejectStatusPipe,
    ShowModalityNamePipe,
    addPeoplePipe,
    validateImpulseZonePipe,
    FormatNameWithoutRolPipe,
    ReorderObservationsPipe,
    FormatIndicatorKpiNumberPipe,
    SectionsHeaderComponent,
    DebounceFilterInputComponent,
    StatusFilterPillsComponent,
  ]
})
export class SharedModule {}