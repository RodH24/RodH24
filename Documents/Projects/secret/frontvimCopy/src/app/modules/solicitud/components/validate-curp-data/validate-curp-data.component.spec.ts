import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurpDataOverviewComponent } from './validate-curp-data.component';

describe('CurpDataOverviewComponent', () => {
  let component: CurpDataOverviewComponent;
  let fixture: ComponentFixture<CurpDataOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurpDataOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurpDataOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
