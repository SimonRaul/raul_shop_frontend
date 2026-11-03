import { Product } from '../../products/types/products.types';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface EnrichedCartItem {
  product: Product;
  quantity: number;
}
