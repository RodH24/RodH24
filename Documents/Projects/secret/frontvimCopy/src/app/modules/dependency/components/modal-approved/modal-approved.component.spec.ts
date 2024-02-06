import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApprovedComponent } from './modal-approved.component';

describe('ModalApprovedComponent', () => {
  let component: ModalApprovedComponent;
  let fixture: ComponentFixture<ModalApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
