import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectedListComponent } from './modal-rejected-list.component';

describe('ModalRejectedListComponent', () => {
  let component: ModalRejectedListComponent;
  let fixture: ComponentFixture<ModalRejectedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRejectedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRejectedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
