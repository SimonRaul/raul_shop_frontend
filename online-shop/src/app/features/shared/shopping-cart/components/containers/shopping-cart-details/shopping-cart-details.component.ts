import {Component, OnInit} from '@angular/core';
import {CartState} from '../../../../types/cart-state.types';
import Decimal from 'decimal.js';

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

  constructor(private shoppingCartService: any) {
  }

  ngOnInit(): void {
    this.cartState = this.shoppingCartService.getCartState();
  }

  onQuantityChange(event: { productId: string; newQuantity: number }): void {
    this.shoppingCartService.updateItemQuantity(event.productId, event.newQuantity);
    this.cartState = this.shoppingCartService.getCartState();
  }

  onItemRemoved(productId: string): void {
    this.shoppingCartService.removeItem(productId);
    this.cartState = this.shoppingCartService.getCartState();
  }
}
