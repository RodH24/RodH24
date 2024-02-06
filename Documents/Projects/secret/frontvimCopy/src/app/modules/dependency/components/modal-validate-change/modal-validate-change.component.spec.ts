import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalValidateChangeComponent } from './modal-validate-change.component';

describe('ModalValidateChangeComponent', () => {
  let component: ModalValidateChangeComponent;
  let fixture: ComponentFixture<ModalValidateChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalValidateChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalValidateChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
