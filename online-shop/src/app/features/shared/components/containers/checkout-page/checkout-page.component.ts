import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CheckoutPageViewComponent } from '../../presentational/checkout-page-view/checkout-page-view.component';
import { Address } from '../../../types/address.types';
import { Checkout } from '../../../types/checkout.types';
import { selectAuth } from '../../../state/app.reducers';
import { Store } from '@ngrx/store';
import { ShoppingCartService } from '../../../shopping-cart/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  imports: [CheckoutPageViewComponent],
  selector: 'app-checkout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-checkout-page-view
    (checkoutClicked)="onCheckout($event)"
    [isCheckedOut]="isCheckedOut()"
    (continueShoppingClicked)="onContinueShopping()"
    [isLoading]="isLoading()"
  ></app-checkout-page-view>`,
})
export class CheckoutPageComponent {
  private readonly store = inject(Store);
  private readonly authState = this.store.selectSignal(selectAuth);
  private readonly shoppingCartService = inject(ShoppingCartService);
  cartState = this.shoppingCartService.getCartState();
  currentUser = computed(() => this.authState().user);
  private readonly router = inject(Router);
  isCheckedOut = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  onCheckout(address: Address) {
    this.isLoading.set(true);
    const user = this.currentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const checkoutData: Checkout = {
      deliveryAddress: address,
      products: this.cartState().items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      customerId: user.id,
      createdAt: new Date(),
    };

    this.shoppingCartService.createOrder(checkoutData).subscribe({
      next: () => {
        this.shoppingCartService.clearCart();
        this.isCheckedOut.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error at sending order:', err);
        this.isLoading.set(false);
      },
    });
  }

  onContinueShopping() {
    this.isCheckedOut.set(false);
    this.router.navigate(['/products']);
  }
}
