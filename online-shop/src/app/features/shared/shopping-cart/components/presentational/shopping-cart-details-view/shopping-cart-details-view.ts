import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem } from '../../../../types/cart-item.types';

@Component({
  imports: [],
  selector: 'app-shopping-cart-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shopping-cart-details-view.scss',
  templateUrl: './shopping-cart-details-view.html',
})
export class ShoppingCartDetailsView {
  totalPrice = input.required<number>();
  totalItems = input.required<number>();
  items = input.required<CartItem[]>();

  quantityChanged = output<{ productId: string; rawValue: string }>();
  itemRemoved = output<string>();

  onCheckout(): void {}
}
