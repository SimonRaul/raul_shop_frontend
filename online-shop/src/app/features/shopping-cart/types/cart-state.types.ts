import { CartItem } from './cart-item.types';

export interface CartState {
  items: CartItem[];
  totalItems: number;
}

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
};
