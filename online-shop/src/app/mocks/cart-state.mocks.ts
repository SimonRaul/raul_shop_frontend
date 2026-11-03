import { mockCartItems } from './cart-item.mocks';
import { CartState } from '../features/shopping-cart/types/cart-state.types';

export const mockCartState: CartState = {
  items: mockCartItems,
  totalItems: 3,
};
