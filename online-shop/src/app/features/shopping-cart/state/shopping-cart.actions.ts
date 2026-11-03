import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem } from '../types/cart-item.types';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ items: CartItem[] }>(),
    'Load Cart Failure': props<{ error: string }>(),
    'Add Item': props<{ productId: string; quantity: number }>(),
    'Update Item Quantity': props<{ productId: string; quantity: number }>(),
    'Remove Item': props<{ productId: string }>(),
    'Clear Cart': emptyProps(),
  },
});
