import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurpSecondGroupDataFormComponent } from './curp-second-group-data-form.component';

describe('CurpSecondGroupDataFormComponent', () => {
  let component: CurpSecondGroupDataFormComponent;
  let fixture: ComponentFixture<CurpSecondGroupDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurpSecondGroupDataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurpSecondGroupDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
