import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApoyosModalComponent } from './apoyos-modal.component';

describe('ApoyosModalComponent', () => {
  let component: ApoyosModalComponent;
  let fixture: ComponentFixture<ApoyosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApoyosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApoyosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
