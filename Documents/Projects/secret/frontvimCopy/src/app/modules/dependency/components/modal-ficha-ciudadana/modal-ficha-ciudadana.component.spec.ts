import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFichaCiudadanaComponent } from './modal-ficha-ciudadana.component';

describe('ModalFichaCiudadanaComponent', () => {
  let component: ModalFichaCiudadanaComponent;
  let fixture: ComponentFixture<ModalFichaCiudadanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFichaCiudadanaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFichaCiudadanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
