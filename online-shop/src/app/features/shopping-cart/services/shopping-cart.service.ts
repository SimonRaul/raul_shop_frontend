import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Checkout } from '../../checkout/types/checkout.types';
import { CartState, initialCartState } from '../types/cart-state.types';
import { Product } from '../../products/types/products.types';
import { CartItem } from '../types/cart-item.types';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  readonly cartState = signal<CartState>(initialCartState);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const saved = localStorage.getItem('shopping_cart_data');
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as CartState;
      this.cartState.set({
        items: parsed.items.map((item) => ({
          ...item,
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
        totalItems: parsed.items.reduce((sum, item) => sum + Number(item.quantity), 0),
      });
    } catch (error) {
      localStorage.removeItem('shopping_cart_data');
      console.error('The saved shopping cart was invalid and has been cleared.', error);
    }
  }

  getCartState() {
    return this.cartState.asReadonly();
  }

  updateItemQuantity(productId: string, newQuantity: string): void {
    const parsedQuantity = Number(newQuantity);
    if (parsedQuantity <= 0 || Number.isNaN(parsedQuantity)) {
      this.removeItem(productId);
      return;
    }

    this.cartState.update((state) => {
      const items = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity: parsedQuantity } : item,
      );
      return this.recalculateState(items);
    });
  }

  removeItem(productId: string | number): void {
    this.cartState.update((state) => {
      const items = state.items.filter((i) => i.productId !== productId);
      return this.recalculateState(items);
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartState.update((state) => {
      const existingItem = state.items.find((i) => i.productId === product.id);
      let items;

      if (existingItem) {
        items = state.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      } else {
        items = [...state.items, { productId: product.id, quantity }];
      }

      return this.recalculateState(items);
    });
  }

  private recalculateState(items: CartItem[]): CartState {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const newState = {
      items,
      totalItems,
    };

    this.saveToLocalStorage(newState);
    return newState;
  }

  private saveToLocalStorage(state: CartState): void {
    localStorage.setItem('shopping_cart_data', JSON.stringify(state));
  }

  clearCart(): void {
    this.cartState.update(() => this.recalculateState([]));
  }

  createOrder(orderData: Checkout) {
    return this.http.post(`${this.apiUrl}/orders`, orderData);
  }
}
