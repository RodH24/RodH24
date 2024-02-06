import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolNewModalComponent } from './rol-new-modal.component';

describe('VentanillaModalComponent', () => {
  let component: RolNewModalComponent;
  let fixture: ComponentFixture<RolNewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolNewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolNewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
