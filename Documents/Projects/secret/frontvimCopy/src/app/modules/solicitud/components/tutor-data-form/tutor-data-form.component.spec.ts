import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorDataFormComponent } from './tutor-data-form.component';

describe('TutorDataFormComponent', () => {
  let component: TutorDataFormComponent;
  let fixture: ComponentFixture<TutorDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorDataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
