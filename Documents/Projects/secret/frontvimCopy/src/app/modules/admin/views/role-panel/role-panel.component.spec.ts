import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePanelComponent } from './role-panel.component';

describe('RolePanelComponent', () => {
  let component: RolePanelComponent;
  let fixture: ComponentFixture<RolePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
