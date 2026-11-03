import { Product } from '../types/products.types';
import { ProductActions } from './products.actions';
import {
  initialProductsState,
  productsAdapter,
  reducer,
  selectProductList,
  selectSelectedProduct,
} from './products.reducers';

describe('productsReducer', () => {
  const product: Product = {
    id: 'product-1',
    name: 'Chair',
    description: 'A chair',
    price: 25,
    weight: 4,
    category: 'Furniture',
    categoryDescription: 'Furniture',
    imageUrl: 'chair.jpg',
  };
  const replacementProduct = { ...product, name: 'Updated chair', price: 30 };

  it('returns the normalized initial state', () => {
    expect(reducer(undefined, { type: '@@init' })).toEqual({
      ids: [],
      entities: {},
      selectedProductId: null,
      isLoading: false,
      error: null,
    });
  });

  it('loads products without discarding existing entities while pending or failing', () => {
    const populatedState = productsAdapter.setOne(product, initialProductsState);

    let state = reducer(populatedState, ProductActions.loadProducts());
    expect(state).toMatchObject({
      ids: [product.id],
      isLoading: true,
      error: null,
    });

    state = reducer(state, ProductActions.loadProductsFailure({ error: 'Unable to load' }));
    expect(state).toMatchObject({
      ids: [product.id],
      isLoading: false,
      error: 'Unable to load',
    });

    state = reducer(state, ProductActions.loadProductsSuccess({ products: [replacementProduct] }));
    expect(state).toMatchObject({
      ids: [product.id],
      entities: { [product.id]: replacementProduct },
      isLoading: false,
      error: null,
    });
  });

  it('upserts and selects a loaded product without replacing the collection', () => {
    const otherProduct = { ...product, id: 'product-2', name: 'Table' };
    let state = productsAdapter.setOne(otherProduct, initialProductsState);

    state = reducer(state, ProductActions.loadSingleProduct({ productId: product.id }));
    expect(state).toMatchObject({
      ids: [otherProduct.id],
      selectedProductId: null,
      isLoading: true,
    });

    state = reducer(state, ProductActions.loadSingleProductSuccess({ product }));
    expect(state.ids).toEqual([otherProduct.id, product.id]);
    expect(state.selectedProductId).toBe(product.id);

    state = reducer(state, ProductActions.clearSelectedProduct());
    expect(state.ids).toEqual([otherProduct.id, product.id]);
    expect(state.selectedProductId).toBeNull();
  });

  it('adds, updates, and deletes products through the adapter', () => {
    let state = reducer(
      initialProductsState,
      ProductActions.addProductSuccess({ product }),
    );
    expect(state.entities[product.id]).toEqual(product);
    expect(state.selectedProductId).toBe(product.id);

    state = reducer(state, ProductActions.updateProductSuccess({ product: replacementProduct }));
    expect(state.entities[product.id]).toEqual(replacementProduct);

    state = reducer(state, ProductActions.deleteProductSuccess({ productId: product.id }));
    expect(state).toMatchObject({
      ids: [],
      entities: {},
      selectedProductId: null,
      isLoading: false,
      error: null,
    });
  });

  it('preserves entities when a product mutation fails', () => {
    const populatedState = productsAdapter.setOne(product, initialProductsState);
    const pendingState = reducer(
      populatedState,
      ProductActions.deleteProduct({ productId: product.id }),
    );
    const failedState = reducer(
      pendingState,
      ProductActions.deleteProductFailure({ error: 'Delete failed' }),
    );

    expect(failedState.entities[product.id]).toEqual(product);
    expect(failedState).toMatchObject({ isLoading: false, error: 'Delete failed' });
  });

  it('denormalizes the list and selected product through selectors', () => {
    const state = productsAdapter.setOne(product, {
      ...initialProductsState,
      selectedProductId: product.id,
    });
    const rootState = { products: state };

    expect(selectProductList(rootState)).toEqual([product]);
    expect(selectSelectedProduct(rootState)).toEqual(product);
  });
});
