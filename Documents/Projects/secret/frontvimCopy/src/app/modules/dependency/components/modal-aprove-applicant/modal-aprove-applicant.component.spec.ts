import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAproveApplicantComponent } from './modal-aprove-applicant.component';

describe('ModalAproveApplicantComponent', () => {
  let component: ModalAproveApplicantComponent;
  let fixture: ComponentFixture<ModalAproveApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAproveApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAproveApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
