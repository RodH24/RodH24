import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDataModalComponent } from './additional-data-modal.component';

describe('AdditionalDataModalComponent', () => {
  let component: AdditionalDataModalComponent;
  let fixture: ComponentFixture<AdditionalDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
