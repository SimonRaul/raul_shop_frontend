import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartActions } from './shopping-cart.actions';
import { CartItem } from '../types/cart-item.types';
import { selectCartItems } from './shopping-cart.reducers';

const CART_STORAGE_KEY = 'shopping_cart_data';

function parseCartItems(savedCart: string): CartItem[] {
  const parsed: unknown = JSON.parse(savedCart);

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('items' in parsed) ||
    !Array.isArray(parsed.items)
  ) {
    throw new Error('Stored cart does not contain an items array.');
  }

  return parsed.items.map((item: unknown) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('productId' in item) ||
      typeof item.productId !== 'string' ||
      !('quantity' in item)
    ) {
      throw new Error('Stored cart contains an invalid item.');
    }

    const quantity = Number(item.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error('Stored cart contains an invalid quantity.');
    }

    return { productId: item.productId, quantity };
  });
}

@Injectable()
export class ShoppingCartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  initializeCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => CartActions.loadCart()),
    ),
  );

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      map(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {
          return CartActions.loadCartSuccess({ items: [] });
        }

        try {
          return CartActions.loadCartSuccess({ items: parseCartItems(savedCart) });
        } catch (error) {
          localStorage.removeItem(CART_STORAGE_KEY);
          console.error('The saved shopping cart was invalid and has been cleared.', error);

          return CartActions.loadCartFailure({
            error: 'The saved shopping cart was invalid and has been cleared.',
          });
        }
      }),
    ),
  );

  persistCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addItem,
          CartActions.updateItemQuantity,
          CartActions.removeItem,
          CartActions.clearCart,
        ),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([, items]) => {
          const totalItems = items.reduce((total, item) => total + item.quantity, 0);

          try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, totalItems }));
          } catch (error) {
            console.error('The shopping cart could not be saved.', error);
          }
        }),
      ),
    { dispatch: false },
  );
}
