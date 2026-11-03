import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CartItem } from '../types/cart-item.types';
import { CartActions } from './shopping-cart.actions';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

export interface CartState extends EntityState<CartItem> {
  isLoading: boolean;
  error: string | null;
}

export const cartAdapter = createEntityAdapter<CartItem>({
  selectId: (item) => item.productId,
});

export const initialCartState: CartState = cartAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const cartFeature = createFeature({
  name: 'cart',
  reducer: createReducer(
    initialCartState,

    on(CartActions.loadCart, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(CartActions.loadCartSuccess, (state, { items }) =>
      cartAdapter.setAll(items, {
        ...state,
        isLoading: false,
        error: null,
      }),
    ),

    on(CartActions.loadCartFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(CartActions.addItem, (state, { productId, quantity }) => {
      const existingItem = state.entities[productId];

      if (existingItem) {
        return cartAdapter.updateOne(
          {
            id: productId,
            changes: {
              quantity: existingItem.quantity + quantity,
            },
          },
          state,
        );
      }

      return cartAdapter.addOne({ productId, quantity }, state);
    }),

    on(CartActions.updateItemQuantity, (state, { productId, quantity }) => {
      if (quantity <= 0 || Number.isNaN(quantity)) {
        return cartAdapter.removeOne(productId, state);
      }

      return cartAdapter.updateOne(
        {
          id: productId,
          changes: { quantity },
        },
        state,
      );
    }),

    on(CartActions.removeItem, (state, { productId }) => cartAdapter.removeOne(productId, state)),

    on(CartActions.clearCart, (state) => cartAdapter.removeAll(state)),
  ),
});

export const {
  selectCartState,
  selectIsLoading: selectCartLoading,
  selectError: selectCartError,
} = cartFeature;

const { selectAll, selectEntities, selectIds, selectTotal } = cartAdapter.getSelectors(
  cartFeature.selectCartState,
);

export const selectCartItems = selectAll;
export const selectCartEntities = selectEntities;
export const selectCartIds = selectIds;
export const selectDistinctCartItems = selectTotal;

export const selectTotalCartQuantity = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);
