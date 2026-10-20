import { Decimal } from 'decimal.js';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Decimal;
  weight: number;
  category: string;
  categoryDescription: string;
  imageUrl: string;
}
