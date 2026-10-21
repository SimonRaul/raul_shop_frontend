import { Decimal } from "decimal.js";
import { Product } from "../features/shared/types/products.types";

export const mockProducts: Product[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "UltraBook Pro Laptop",
    description: "Thin and light laptop with the latest generation processor, 16GB RAM, and a 4K display.",
    price: new Decimal("5499.99"),
    weight: 1.25,
    category: "Electronics",
    categoryDescription: "Electronic devices, computers, and accessories.",
    imageUrl: "https://example.com/images/laptop.jpg"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation (ANC) and 30-hour battery life.",
    price: new Decimal("1299.50"),
    weight: 0.25,
    category: "Audio",
    categoryDescription: "Audio equipment, headphones, speakers, and related accessories.",
    imageUrl: "https://example.com/images/headphones.jpg"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Espresso Arabica Coffee Beans",
    description: "Premium blend of dark roast Arabica coffee, ideal for an authentic espresso.",
    price: new Decimal("85.00"),
    weight: 1.0, // 1 kg
    category: "Groceries",
    categoryDescription: "Non-perishable everyday food and pantry items.",
    imageUrl: "https://example.com/images/coffee-beans.jpg"
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Ergonomic Office Chair",
    description: "Office chair with adjustable lumbar support, headrest, and a breathable mesh back.",
    price: new Decimal("850.75"),
    weight: 15.5,
    category: "Furniture",
    categoryDescription: "Home and office furniture, chairs, and desks.",
    imageUrl: "https://example.com/images/office-chair.jpg"
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "RGB Mechanical Keyboard",
    description: "Mechanical gaming keyboard with quiet red switches and customizable RGB lighting.",
    price: new Decimal("450.00"),
    weight: 0.85,
    category: "PC Peripherals",
    categoryDescription: "Keyboards, mice, and other computer peripherals.",
    imageUrl: "https://example.com/images/mechanical-keyboard.jpg"
  }
];
