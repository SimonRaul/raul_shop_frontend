import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItem} from '../../../../types/cart-item.types';
import Decimal from 'decimal.js';

@Component({
  standalone: false,
  selector: 'app-shopping-cart-details-view',
  styleUrl: './shopping-cart-details-view.scss',
  templateUrl: './shopping-cart-details-view.html',
})
export class ShoppingCartDetailsView {
  @Input({required: true}) totalPrice!: Decimal;
  @Input({required: true}) totalItems!: number;
  @Input({required: true}) items!: CartItem[];

  @Output() quantityChanged = new EventEmitter<{ productId: string; newQuantity: number }>();
  @Output() itemRemoved = new EventEmitter<string>();

  onQuantityChange(productId: string, rawValue: string): void {
    const newQuantity: number = Number(rawValue);

    if (newQuantity > 0) {
      this.quantityChanged.emit({ productId, newQuantity });
    }
  }

  onRemove(productId: string): void {
    this.itemRemoved.emit(productId);
  }

  onCheckout(): void {
    // Implement checkout logic here
  }
}

