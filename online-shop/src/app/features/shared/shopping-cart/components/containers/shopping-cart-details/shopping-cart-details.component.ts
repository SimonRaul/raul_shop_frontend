import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShoppingCartDetailsView } from '../../presentational/shopping-cart-details-view/shopping-cart-details-view';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
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
  cartState = this.shoppingCartService.getCartState();

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
