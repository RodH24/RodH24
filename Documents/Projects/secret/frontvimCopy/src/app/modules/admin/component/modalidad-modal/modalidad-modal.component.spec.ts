import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadModalComponent } from './modalidad-modal.component';

describe('ModalidadModalComponent', () => {
  let component: ModalidadModalComponent;
  let fixture: ComponentFixture<ModalidadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalidadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
