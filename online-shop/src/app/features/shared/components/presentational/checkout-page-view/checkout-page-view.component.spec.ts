import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutPageViewComponent } from './checkout-page-view.component';

describe('CheckoutPageViewComponent', () => {
  let component: CheckoutPageViewComponent;
  let fixture: ComponentFixture<CheckoutPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPageViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
