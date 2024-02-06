import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliveredApplicantComponent } from './modal-delivered-applicant.component';

describe('ModalDeliveredApplicantComponent', () => {
  let component: ModalDeliveredApplicantComponent;
  let fixture: ComponentFixture<ModalDeliveredApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeliveredApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeliveredApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
