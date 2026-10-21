import {CartItem} from '../features/shared/types/cart-item.types';
import {mockProducts} from './products.mocks';

export const mockCartItems: CartItem[] = [
  {
    product: mockProducts[0],
    quantity: 1
  },
  {
    product: mockProducts[1],
    quantity: 2
  }
];
