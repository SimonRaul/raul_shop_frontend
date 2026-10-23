import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CartItem } from '../../../../types/cart-item.types';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../../types/address.types';

@Component({
  imports: [FormsModule],
  selector: 'app-shopping-cart-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './shopping-cart-details-view.scss',
  templateUrl: './shopping-cart-details-view.html',
})
export class ShoppingCartDetailsView {
  totalPrice = input.required<number>();
  totalItems = input.required<number>();
  items = input.required<CartItem[]>();

  country = '';
  city = '';
  county = '';
  streetAddress = '';

  quantityChanged = output<{ productId: string; rawValue: string }>();
  itemRemoved = output<string>();
  checkoutClicked = output<Address>();

  onCheckout(): void {
    if (
      this.country.trim() &&
      this.city.trim() &&
      this.county.trim() &&
      this.streetAddress.trim()
    ) {
      const address: Address = {
        country: this.country,
        city: this.city,
        county: this.county,
        streetAddress: this.streetAddress,
      };
      this.checkoutClicked.emit(address);
    }
  }
}
