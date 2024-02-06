import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFilesUploadComponent } from './first-files-upload.component';

describe('UserInputDataOverviewComponent', () => {
  let component: FirstFilesUploadComponent;
  let fixture: ComponentFixture<FirstFilesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstFilesUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstFilesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
