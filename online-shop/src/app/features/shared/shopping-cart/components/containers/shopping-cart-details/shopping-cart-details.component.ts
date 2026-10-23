import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShoppingCartDetailsView } from '../../presentational/shopping-cart-details-view/shopping-cart-details-view';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { Address } from '../../../../types/address.types';
import { Checkout } from '../../../../types/checkout.types';
import { Router } from '@angular/router';

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
  cartState = this.shoppingCartService.getCartState();
  private readonly router = inject(Router);

  onQuantityChange(event: { productId: string; rawValue: string }): void {
    this.shoppingCartService.updateItemQuantity(event.productId, event.rawValue);
  }

  onItemRemoved(productId: string): void {
    this.shoppingCartService.removeItem(productId);
  }
  onCheckout(address: Address): void {
    const checkoutData: Checkout = {
      deliveryAddress: address,
      products: this.cartState().items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      createdAt: new Date(),
    };

    this.shoppingCartService.createOrder(checkoutData).subscribe({
      next: (response) => {
        this.shoppingCartService.clearCart();
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Eroare la trimiterea comenzii:', err);
      },
    });
  }
}
