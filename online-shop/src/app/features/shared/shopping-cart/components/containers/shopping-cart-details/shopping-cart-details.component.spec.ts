import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { ShoppingCartDetailsComponent } from './shopping-cart-details.component';

describe('ShoppingCartDetailsComponent', () => {
  let component: ShoppingCartDetailsComponent;
  let fixture: ComponentFixture<ShoppingCartDetailsComponent>;
  let updateItemQuantity: ReturnType<typeof vi.fn>;
  let removeItem: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateItemQuantity = vi.fn();
    removeItem = vi.fn();
    navigate = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ShoppingCartDetailsComponent],
      providers: [
        {
          provide: ShoppingCartService,
          useValue: {
            getCartState: () => signal({ items: [], totalItems: 0, totalPrice: 0 }),
            updateItemQuantity,
            removeItem,
          },
        },
        { provide: Router, useValue: { navigate } },
        { provide: Store, useValue: {} },
      ],
    }).overrideComponent(ShoppingCartDetailsComponent, {
      set: { template: '' },
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartDetailsComponent);
    component = fixture.componentInstance;
  });

  it('delegates quantity and removal changes to the cart service', () => {
    component.onQuantityChange({ productId: 'product-1', rawValue: '4' });
    component.onItemRemoved('product-1');

    expect(updateItemQuantity).toHaveBeenCalledWith('product-1', '4');
    expect(removeItem).toHaveBeenCalledWith('product-1');
  });

  it('navigates to checkout', () => {
    component.onCheckout();

    expect(navigate).toHaveBeenCalledWith(['checkout']);
  });
});
