import {Component, OnInit} from '@angular/core';
import {CartState} from '../../../../types/cart-state.types';
import Decimal from 'decimal.js';
import {mockCartState} from '../../../../../../mocks/cart-state.mocks';

@Component({
  standalone: false,
  selector: 'app-shopping-cart-details',
  styleUrl: './shopping-cart-details.component.scss',
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
    totalPrice: new Decimal(0),
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
    const item = this.cartState.items.find(i => i.product.id === event.productId);
    if (item) {
      const newQuantity = Number(event.rawValue);

      if (newQuantity > 0) {
        item.quantity = newQuantity;
        this.recalculateMockState()
      }
      else{
        this.onItemRemoved(event.productId);
      }
    }
  }

  onItemRemoved(productId: string): void {
    // this.shoppingCartService.removeItem(productId);
    // this.cartState = this.shoppingCartService.getCartState();
    this.cartState.items = this.cartState.items.filter(item => item.product.id !== productId);
    this.recalculateMockState()
  }

  private recalculateMockState(): void {
    this.cartState.totalItems = this.cartState.items.reduce((sum, item) => sum + item.quantity, 0);

    this.cartState.totalPrice = this.cartState.items.reduce(
      (sum, item) => sum.plus(new Decimal(item.product.price).times(item.quantity)),
      new Decimal(0)
    );
  }
}
