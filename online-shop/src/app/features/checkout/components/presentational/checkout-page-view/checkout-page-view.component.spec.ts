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
    fixture.componentRef.setInput('isCheckedOut', false);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('emits the entered address when the form is valid', () => {
    const checkout = vi.fn();
    component.checkoutClicked.subscribe(checkout);
    component.checkoutForm.setValue({
      country: 'Romania',
      city: 'Cluj-Napoca',
      county: 'Cluj',
      streetAddress: '1 Main Street',
    });

    component.onCheckout();

    expect(checkout).toHaveBeenCalledWith({
      country: 'Romania',
      city: 'Cluj-Napoca',
      county: 'Cluj',
      streetAddress: '1 Main Street',
    });
  });

  it('marks an invalid form as touched without emitting', () => {
    const checkout = vi.fn();
    component.checkoutClicked.subscribe(checkout);

    component.onCheckout();

    expect(checkout).not.toHaveBeenCalled();
    expect(component.checkoutForm.controls.country.touched).toBe(true);
    expect(component.checkoutForm.controls.streetAddress.touched).toBe(true);
  });

  it('renders the checkout error as an alert', () => {
    fixture.componentRef.setInput('errorMessage', 'Order failed');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('[role="alert"]');

    expect(error).toBeTruthy();
    expect(error.textContent).toContain('Order failed');
  });

  it('renders the success state and emits when continuing shopping', () => {
    const continueShopping = vi.fn();
    component.continueShoppingClicked.subscribe(continueShopping);
    fixture.componentRef.setInput('isCheckedOut', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Checkout Successful');
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(continueShopping).toHaveBeenCalled();
  });
});
