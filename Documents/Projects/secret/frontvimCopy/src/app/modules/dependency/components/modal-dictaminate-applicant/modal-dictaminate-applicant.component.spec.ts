import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDictaminateApplicantComponent } from './modal-dictaminate-applicant.component';

describe('ModalDictaminateApplicantComponent', () => {
  let component: ModalDictaminateApplicantComponent;
  let fixture: ComponentFixture<ModalDictaminateApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDictaminateApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDictaminateApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
