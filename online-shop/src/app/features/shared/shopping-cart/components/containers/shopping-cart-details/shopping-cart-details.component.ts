import { Component, OnInit } from '@angular/core';
import { CartState } from '../../../../types/cart-state.types';
import { mockCartState } from '../../../../../../mocks/cart-state.mocks';

@Component({
  standalone: false,
  selector: 'app-shopping-cart-details',
  template: `
    <app-shopping-cart-details-view
      [totalPrice]="cartState.totalPrice"
      [totalItems]="cartState.totalItems"
      [items]="cartState.items"
      (quantityChanged)="onQuantityChange($event)"
      (itemRemoved)="onItemRemoved($event)"
    ></app-shopping-cart-details-view>
  `,
})
export class ShoppingCartDetailsComponent implements OnInit {
  cartState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };

  // constructor(private shoppingCartService: any) {
  // }

  ngOnInit(): void {
    // this.cartState = this.shoppingCartService.getCartState();
    this.cartState = mockCartState;
  }

  onQuantityChange(event: { productId: string; rawValue: string }): void {
    // this.shoppingCartService.updateItemQuantity(event.productId, event.newQuantity);
    // this.cartState = this.shoppingCartService.getCartState();
    const item = this.cartState.items.find((i) => i.product.id === event.productId);
    if (item) {
      const newQuantity = Number(event.rawValue);

      if (newQuantity > 0) {
        item.quantity = newQuantity;
        this.recalculateMockState();
      } else {
        this.onItemRemoved(event.productId);
      }
    }
  }

  onItemRemoved(productId: string): void {
    // this.shoppingCartService.removeItem(productId);
    // this.cartState = this.shoppingCartService.getCartState();
    this.cartState.items = this.cartState.items.filter((item) => item.product.id !== productId);
    this.recalculateMockState();
  }

  private recalculateMockState(): void {
    this.cartState.totalItems = this.cartState.items.reduce((sum, item) => sum + item.quantity, 0);

    const rawTotal = this.cartState.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    this.cartState.totalPrice = Number(rawTotal.toFixed(2));
  }
}
