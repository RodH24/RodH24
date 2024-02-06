import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeSelectModalComponent } from './office-select-modal.component';

describe('OfficeSelectModalComponent', () => {
  let component: OfficeSelectModalComponent;
  let fixture: ComponentFixture<OfficeSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficeSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
