import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ShoppingCartDetailsView } from '../../presentational/shopping-cart-details-view/shopping-cart-details-view';
import { Address } from '../../../../types/address.types';
import { Checkout } from '../../../../types/checkout.types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuth, selectShoppingCart } from '../../../../state/app.reducers';
import { ShoppingCartActions } from '../../../../state/app.actions';

@Component({
  imports: [ShoppingCartDetailsView],
  selector: 'app-shopping-cart-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-shopping-cart-details-view
      [totalPrice]="totalPrice()"
      [totalItems]="totalItems()"
      [items]="cartItems()"
      (checkoutClicked)="onCheckout($event)"
      (quantityChanged)="onQuantityChange($event)"
      (itemRemoved)="onItemRemoved($event)"
    ></app-shopping-cart-details-view>
  `,
})
export class ShoppingCartDetailsComponent {
  private store = inject(Store);
  private cartState = this.store.selectSignal(selectShoppingCart);
  private authState = this.store.selectSignal(selectAuth);
  currentUser = computed(() => this.authState().user);
  private readonly router = inject(Router);
  totalPrice = computed(() => this.cartState().totalPrice);
  totalItems = computed(() => this.cartState().totalItems);
  cartItems = computed(() => this.cartState().items);

  onQuantityChange(event: { productId: string; rawValue: string }): void {
    this.store.dispatch(
      ShoppingCartActions.updateQuantity({
        productId: event.productId,
        newQuantity: Number(event.rawValue),
      }),
    );
  }

  onItemRemoved(productId: string): void {
    this.store.dispatch(ShoppingCartActions.removeFromCart({ productId }));
  }

  onCheckout(address: Address): void {
    const user = this.currentUser();

    if (!user) {
      console.error('Cannot checkout: User is not authenticated.');
      return;
    }

    const checkoutData: Checkout = {
      deliveryAddress: address,
      products: this.cartItems().map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      customerId: user.id,
      createdAt: new Date(),
    };

    this.store.dispatch(ShoppingCartActions.checkout({ checkoutData }));
  }
}
