import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolTabContentComponent } from './rol-tab-content.component';

describe('RolTabContentComponent', () => {
  let component: RolTabContentComponent;
  let fixture: ComponentFixture<RolTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolTabContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
