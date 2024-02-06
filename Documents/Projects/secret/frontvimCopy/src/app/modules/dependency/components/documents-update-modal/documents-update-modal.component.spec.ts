import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsUpdateModalComponent } from './documents-update-modal.component';

describe('DocumentsUpdateModalComponent', () => {
  let component: DocumentsUpdateModalComponent;
  let fixture: ComponentFixture<DocumentsUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
