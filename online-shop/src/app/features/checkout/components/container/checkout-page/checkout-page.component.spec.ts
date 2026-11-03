import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { ShoppingCartService } from '../../../../shopping-cart/services/shopping-cart.service';
import { Product } from '../../../../products/types/products.types';
import { CheckoutPageComponent } from './checkout-page.component';
import { selectUser } from '../../../../auth/state/auth.reducers';

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let authState: ReturnType<typeof signal>;
  let cartState: ReturnType<typeof signal>;
  let shoppingCartService: {
    getCartState: ReturnType<typeof vi.fn>;
    createOrder: ReturnType<typeof vi.fn>;
    clearCart: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const product: Product = {
    id: 'product-1',
    name: 'Desk',
    description: 'A wooden desk',
    price: 250,
    weight: 20,
    category: 'Furniture',
    categoryDescription: 'Furniture products',
    imageUrl: 'desk.jpg',
  };
  const address = {
    country: 'Romania',
    city: 'Cluj-Napoca',
    county: 'Cluj',
    streetAddress: '1 Main Street',
  };

  beforeEach(async () => {
    authState = signal({
      id: 'customer-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      username: 'jane',
      role: 'CUSTOMER',
    });
    cartState = signal({
      items: [{ productId: product.id, quantity: 2 }],
      totalItems: 2,
    });
    shoppingCartService = {
      getCartState: vi.fn(() => cartState.asReadonly()),
      createOrder: vi.fn(),
      clearCart: vi.fn(),
    };
    router = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            selectSignal: vi.fn((selector: unknown) =>
              selector === selectUser ? authState.asReadonly() : signal(null),
            ),
          },
        },
        { provide: ShoppingCartService, useValue: shoppingCartService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('redirects unauthenticated customers to login', () => {
    authState.set(null);

    component.onCheckout(address);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(shoppingCartService.createOrder).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('creates an order with the current address, cart, and customer', () => {
    shoppingCartService.createOrder.mockReturnValue(of({}));

    component.onCheckout(address);

    expect(shoppingCartService.createOrder).toHaveBeenCalledOnce();
    const checkoutData = shoppingCartService.createOrder.mock.calls[0][0];
    expect(checkoutData).toMatchObject({
      deliveryAddress: address,
      products: [{ productId: 'product-1', quantity: 2 }],
      customerId: 'customer-1',
    });
    expect(checkoutData.createdAt).toBeInstanceOf(Date);
    expect(shoppingCartService.clearCart).toHaveBeenCalledOnce();
    expect(component.isCheckedOut()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('shows an error and clears loading state when order creation fails', () => {
    const error = new Error('Order failed');
    shoppingCartService.createOrder.mockReturnValue(throwError(() => error));

    component.onCheckout(address);

    expect(shoppingCartService.clearCart).not.toHaveBeenCalled();
    expect(component.isCheckedOut()).toBe(false);
    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Order failed');
  });

  it('clears a previous checkout error when retrying', () => {
    component.errorMessage.set('Order failed');
    shoppingCartService.createOrder.mockReturnValue(of({}));

    component.onCheckout(address);

    expect(component.errorMessage()).toBeNull();
  });

  it('resets checkout state and navigates to products when continuing shopping', () => {
    component.isCheckedOut.set(true);

    component.onContinueShopping();

    expect(component.isCheckedOut()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('passes checkout state and handlers to the presentational view', () => {
    component.isCheckedOut.set(true);
    component.isLoading.set(true);
    component.errorMessage.set('Order failed');
    fixture.detectChanges();

    const view = fixture.nativeElement.querySelector('app-checkout-page-view');

    expect(view).toBeTruthy();
    expect(component.isCheckedOut()).toBe(true);
    expect(component.isLoading()).toBe(true);
    expect(view.textContent).toContain('Checkout Successful');
  });
});
