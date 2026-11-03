import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ShoppingCartDetailsView } from '../../presentational/shopping-cart-details-view/shopping-cart-details-view';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { Store } from '@ngrx/store';
import { selectProductList } from '../../../../products/state/products.reducers';
import { EnrichedCartItem } from '../../../types/cart-item.types';

@Component({
  imports: [ShoppingCartDetailsView],
  selector: 'app-shopping-cart-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-shopping-cart-details-view
      [totalPrice]="totalPrice()"
      [totalItems]="totalItems()"
      [items]="enrichedCartItems()"
      (checkoutClicked)="onCheckout()"
      (quantityChanged)="onQuantityChange($event)"
      (itemRemoved)="onItemRemoved($event)"
    ></app-shopping-cart-details-view>
  `,
})
export class ShoppingCartDetailsComponent {
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly rawCartState = this.shoppingCartService.getCartState();
  private readonly productList = this.store.selectSignal(selectProductList);

  readonly enrichedCartItems = computed(() => {
    const allProducts = this.productList();
    const cartItems = this.rawCartState().items;

    return cartItems
      .map((cartItem) => {
        const product = allProducts.find((p) => p.id === cartItem.productId);
        return product ? { product, quantity: cartItem.quantity } : null;
      })
      .filter((item): item is EnrichedCartItem => item !== null);
  });

  readonly totalItems = computed(() => {
    return this.enrichedCartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly totalPrice = computed(() => {
    return this.enrichedCartItems().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  });

  onQuantityChange(event: { productId: string; rawValue: string }): void {
    this.shoppingCartService.updateItemQuantity(event.productId, event.rawValue);
  }

  onItemRemoved(productId: string): void {
    this.shoppingCartService.removeItem(productId);
  }
  onCheckout(): void {
    this.router.navigate(['checkout']);
  }
}
