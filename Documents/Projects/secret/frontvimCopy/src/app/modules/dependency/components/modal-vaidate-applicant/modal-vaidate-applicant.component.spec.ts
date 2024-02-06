import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVaidateApplicantComponent } from './modal-vaidate-applicant.component';

describe('ModalVaidateApplicantComponent', () => {
  let component: ModalVaidateApplicantComponent;
  let fixture: ComponentFixture<ModalVaidateApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVaidateApplicantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVaidateApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
