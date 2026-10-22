import { Decimal } from 'decimal.js';
import { Product } from '../features/shared/types/products.types';

export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Default Product',
  description: 'Default product description.',
  price: new Decimal('100.00'),
  weight: 1.0,
  category: 'General',
  categoryDescription: 'General category.',
  imageUrl: 'https://example.com/images/default.jpg',
  ...overrides,
});

export const mockProducts: Product[] = [
  createMockProduct({
    id: '11111111-1111-1111-1111-111111111111',
    name: 'UltraBook Pro Laptop',
    description:
      'Thin and light laptop with the latest generation processor, 16GB RAM, and a 4K display.',
    price: new Decimal('5499.99'),
    weight: 1.25,
    category: 'Electronics',
    categoryDescription: 'Electronic devices, computers, and accessories.',
    imageUrl: 'https://example.com/images/laptop.jpg',
  }),
  createMockProduct({
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Over-ear headphones with active noise cancellation (ANC) and 30-hour battery life.',
    price: new Decimal('1299.50'),
    weight: 0.25,
    category: 'Audio',
    categoryDescription: 'Audio equipment, headphones, speakers, and related accessories.',
    imageUrl: 'https://example.com/images/headphones.jpg',
  }),
  createMockProduct({
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Espresso Arabica Coffee Beans',
    description: 'Premium blend of dark roast Arabica coffee, ideal for an authentic espresso.',
    price: new Decimal('85.00'),
    weight: 1.0,
    category: 'Groceries',
    categoryDescription: 'Non-perishable everyday food and pantry items.',
    imageUrl: 'https://example.com/images/coffee-beans.jpg',
  }),
];
