import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficePanelComponent } from './office-panel.component';

describe('OfficePanelComponent', () => {
  let component: OfficePanelComponent;
  let fixture: ComponentFixture<OfficePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
