import { CartItem } from '../features/shopping-cart/types/cart-item.types';
import { mockProducts } from './products.mocks';

export const mockCartItems: CartItem[] = [
  {
    productId: mockProducts[0].id,
    quantity: 1,
  },
  {
    productId: mockProducts[1].id,
    quantity: 2,
  },
];
