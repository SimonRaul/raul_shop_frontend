import Decimal from 'decimal.js';
import {mockCartItems} from './cart-item.mocks';
import {CartState} from '../features/shared/types/cart-state.types';

export const mockCartState: CartState = {
  items: mockCartItems,
  totalItems: 3,
  totalPrice: new Decimal('8098.99')
};
