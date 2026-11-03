import { CartActions } from './shopping-cart.actions';
import {
  CartState,
  cartAdapter,
  cartFeature,
  initialCartState,
  selectCartEntities,
  selectCartIds,
  selectCartItems,
  selectDistinctCartItems,
  selectTotalCartQuantity,
} from './shopping-cart.reducers';
import { CartItem } from '../types/cart-item.types';

describe('cartReducer', () => {
  const firstItem: CartItem = { productId: 'product-1', quantity: 2 };
  const secondItem: CartItem = { productId: 'product-2', quantity: 1 };
  const { reducer } = cartFeature;

  it('returns the normalized initial state', () => {
    expect(reducer(undefined, { type: '@@init' })).toEqual({
      ids: [],
      entities: {},
      isLoading: false,
      error: null,
    });
  });

  it('tracks cart loading and failure states without discarding items', () => {
    const populatedState = cartAdapter.setOne(firstItem, initialCartState);

    let state = reducer(populatedState, CartActions.loadCart());
    expect(state).toMatchObject({
      ids: [firstItem.productId],
      entities: { [firstItem.productId]: firstItem },
      isLoading: true,
      error: null,
    });

    state = reducer(state, CartActions.loadCartFailure({ error: 'Unable to load cart' }));
    expect(state).toMatchObject({
      ids: [firstItem.productId],
      entities: { [firstItem.productId]: firstItem },
      isLoading: false,
      error: 'Unable to load cart',
    });
  });

  it('replaces cart items on a successful load', () => {
    const state = reducer(
      cartAdapter.setOne(firstItem, initialCartState),
      CartActions.loadCartSuccess({ items: [secondItem] }),
    );

    expect(state).toEqual({
      ids: [secondItem.productId],
      entities: { [secondItem.productId]: secondItem },
      isLoading: false,
      error: null,
    });
  });

  it('adds new items and increases the quantity of existing items', () => {
    let state = reducer(initialCartState, CartActions.addItem(firstItem));
    expect(state.entities[firstItem.productId]).toEqual(firstItem);

    state = reducer(state, CartActions.addItem({ productId: firstItem.productId, quantity: 3 }));
    expect(state.entities[firstItem.productId]).toEqual({
      productId: firstItem.productId,
      quantity: 5,
    });
  });

  it('updates item quantities and removes invalid quantities', () => {
    let state = cartAdapter.setOne(firstItem, initialCartState);

    state = reducer(
      state,
      CartActions.updateItemQuantity({ productId: firstItem.productId, quantity: 4 }),
    );
    expect(state.entities[firstItem.productId]?.quantity).toBe(4);

    state = reducer(
      state,
      CartActions.updateItemQuantity({ productId: firstItem.productId, quantity: 0 }),
    );
    expect(state.entities[firstItem.productId]).toBeUndefined();

    state = cartAdapter.setOne(firstItem, initialCartState);
    state = reducer(
      state,
      CartActions.updateItemQuantity({
        productId: firstItem.productId,
        quantity: Number.NaN,
      }),
    );
    expect(state.entities[firstItem.productId]).toBeUndefined();
  });

  it('removes one item and clears the entire cart', () => {
    let state = cartAdapter.setAll([firstItem, secondItem], initialCartState);

    state = reducer(state, CartActions.removeItem({ productId: firstItem.productId }));
    expect(state.entities).toEqual({ [secondItem.productId]: secondItem });

    state = reducer(state, CartActions.clearCart());
    expect(state).toEqual({
      ids: [],
      entities: {},
      isLoading: false,
      error: null,
    });
  });

  it('selects normalized items and total quantity from the cart feature state', () => {
    const state: CartState = cartAdapter.setAll([firstItem, secondItem], initialCartState);
    const rootState = { cart: state };

    expect(selectCartItems(rootState)).toEqual([firstItem, secondItem]);
    expect(selectCartEntities(rootState)).toEqual({
      [firstItem.productId]: firstItem,
      [secondItem.productId]: secondItem,
    });
    expect(selectCartIds(rootState)).toEqual([firstItem.productId, secondItem.productId]);
    expect(selectDistinctCartItems(rootState)).toBe(2);
    expect(selectTotalCartQuantity(rootState)).toBe(3);
  });
});
