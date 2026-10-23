import { Address } from './address.types';

export interface Checkout {
  deliveryAddress: Address;
  createdAt: Date;
  products: {
    productId: string;
    quantity: number;
  }[];
}
