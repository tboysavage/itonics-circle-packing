// Component testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclePackingComponent } from './circle-packing.component';

describe('CirclePackingComponent', () => {
  let component: CirclePackingComponent;
  let fixture: ComponentFixture<CirclePackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclePackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
