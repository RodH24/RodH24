import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDataFormComponent } from './contact-data-form.component';

describe('ContactDataFormComponent', () => {
  let component: ContactDataFormComponent;
  let fixture: ComponentFixture<ContactDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactDataFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
