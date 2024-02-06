import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTreeModalComponent } from './action-tree-modal.component';

describe('ActionTreeModalComponent', () => {
  let component: ActionTreeModalComponent;
  let fixture: ComponentFixture<ActionTreeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTreeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionTreeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
