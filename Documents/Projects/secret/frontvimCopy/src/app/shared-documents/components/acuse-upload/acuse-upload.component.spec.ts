import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuseUploadComponent } from './acuse-upload.component';

describe('AcuseUploadComponent', () => {
  let component: AcuseUploadComponent;
  let fixture: ComponentFixture<AcuseUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcuseUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcuseUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
