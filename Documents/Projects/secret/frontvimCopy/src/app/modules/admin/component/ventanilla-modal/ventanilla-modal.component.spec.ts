import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanillaModalComponent } from './ventanilla-modal.component';

describe('VentanillaModalComponent', () => {
  let component: VentanillaModalComponent;
  let fixture: ComponentFixture<VentanillaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanillaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanillaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
