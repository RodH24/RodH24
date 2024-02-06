import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeMapModalComponent } from './office-map-modal.component';

describe('OfficeMapModalComponent', () => {
  let component: OfficeMapModalComponent;
  let fixture: ComponentFixture<OfficeMapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeMapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
