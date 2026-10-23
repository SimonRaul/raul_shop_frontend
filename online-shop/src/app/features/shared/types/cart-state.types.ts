import { CartItem } from './cart-item.types';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
