import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurpInputComponent } from './curp-input.component';

describe('CurpInputComponent', () => {
  let component: CurpInputComponent;
  let fixture: ComponentFixture<CurpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurpInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
