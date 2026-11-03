import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EnrichedCartItem } from '../../../types/cart-item.types';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  selector: 'app-shopping-cart-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shopping-cart-details-view.scss',
  templateUrl: './shopping-cart-details-view.html',
})
export class ShoppingCartDetailsView {
  readonly totalPrice = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly items = input.required<EnrichedCartItem[]>();

  readonly quantityChanged = output<{ productId: string; rawValue: string }>();
  readonly itemRemoved = output<string>();
  readonly checkoutClicked = output<void>();
}
