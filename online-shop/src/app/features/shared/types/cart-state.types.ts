import { CartItem } from './cart-item.types';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
