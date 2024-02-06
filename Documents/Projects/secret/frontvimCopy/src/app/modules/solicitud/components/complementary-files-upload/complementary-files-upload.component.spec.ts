import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementaryFilesUploadComponent } from './complementary-files-upload.component';

describe('ComplementaryFilesUploadComponent', () => {
  let component: ComplementaryFilesUploadComponent;
  let fixture: ComponentFixture<ComplementaryFilesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplementaryFilesUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementaryFilesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
