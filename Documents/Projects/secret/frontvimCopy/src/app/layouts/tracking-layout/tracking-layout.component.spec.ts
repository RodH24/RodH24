import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingLayoutComponent } from './tracking-layout.component';

describe('TrackingLayoutComponent', () => {
  let component: TrackingLayoutComponent;
  let fixture: ComponentFixture<TrackingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
