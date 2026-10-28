import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ShoppingCartDetailsView } from '../../presentational/shopping-cart-details-view/shopping-cart-details-view';
import { Address } from '../../../../types/address.types';
import { Checkout } from '../../../../types/checkout.types';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { selectAuth } from '../../../../state/app.reducers';
import { Store } from '@ngrx/store';

@Component({
  imports: [ShoppingCartDetailsView],
  selector: 'app-shopping-cart-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-shopping-cart-details-view
      [totalPrice]="cartState().totalPrice"
      [totalItems]="cartState().totalItems"
      [items]="cartState().items"
      (checkoutClicked)="onCheckout($event)"
      (quantityChanged)="onQuantityChange($event)"
      (itemRemoved)="onItemRemoved($event)"
    ></app-shopping-cart-details-view>
  `,
})
export class ShoppingCartDetailsComponent {
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly authState = this.store.selectSignal(selectAuth);
  cartState = this.shoppingCartService.getCartState();
  currentUser = computed(() => this.authState().user);

  onQuantityChange(event: { productId: string; rawValue: string }): void {
    this.shoppingCartService.updateItemQuantity(event.productId, event.rawValue);
  }

  onItemRemoved(productId: string): void {
    this.shoppingCartService.removeItem(productId);
  }
  onCheckout(address: Address): void {
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
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error at sending order:', err);
      },
    });
  }
}
