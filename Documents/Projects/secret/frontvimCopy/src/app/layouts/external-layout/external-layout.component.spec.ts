import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLayoutComponent } from './external-layout.component';

describe('ExternalLayoutComponent', () => {
  let component: ExternalLayoutComponent;
  let fixture: ComponentFixture<ExternalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
