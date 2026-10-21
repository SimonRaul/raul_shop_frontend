import {CartItem} from './cart-item.types';
import Decimal from 'decimal.js';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: Decimal;
}
