import { Product } from '../types/products.types';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ProductActions } from './products.actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface ProductsState extends EntityState<Product> {
  selectedProductId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const productsAdapter = createEntityAdapter<Product>({
  selectId: (product) => product.id,
});

export const initialProductsState: ProductsState = productsAdapter.getInitialState({
  selectedProductId: null,
  isLoading: false,
  error: null,
});

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialProductsState,

    on(ProductActions.loadProducts, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ProductActions.loadProductsSuccess, (state, { products }) =>
      productsAdapter.setAll(products, {
        ...state,
        isLoading: false,
        error: null,
      }),
    ),

    on(ProductActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    on(ProductActions.loadSingleProduct, (state) => ({
      ...state,
      selectedProductId: null,
      isLoading: true,
      error: null,
    })),
    on(ProductActions.loadSingleProductSuccess, (state, { product }) =>
      productsAdapter.upsertOne(product, {
        ...state,
        selectedProductId: product.id,
        isLoading: false,
        error: null,
      }),
    ),
    on(ProductActions.loadSingleProductFailure, (state, { error }) => ({
      ...state,
      selectedProductId: null,
      isLoading: false,
      error,
    })),
    on(
      ProductActions.addProduct,
      ProductActions.updateProduct,
      ProductActions.deleteProduct,
      (state) => ({
        ...state,
        isLoading: true,
        error: null,
      }),
    ),
    on(ProductActions.addProductSuccess, (state, { product }) =>
      productsAdapter.addOne(product, {
        ...state,
        selectedProductId: product.id,
        isLoading: false,
        error: null,
      }),
    ),
    on(ProductActions.updateProductSuccess, (state, { product }) =>
      productsAdapter.upsertOne(product, {
        ...state,
        selectedProductId: product.id,
        isLoading: false,
        error: null,
      }),
    ),

    on(ProductActions.deleteProductSuccess, (state, { productId }) =>
      productsAdapter.removeOne(productId, {
        ...state,
        selectedProductId: null,
        isLoading: false,
        error: null,
      }),
    ),
    on(
      ProductActions.addProductFailure,
      ProductActions.updateProductFailure,
      ProductActions.deleteProductFailure,
      (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
      }),
    ),
    on(ProductActions.clearSelectedProduct, (state) => ({
      ...state,
      selectedProductId: null,
      error: null,
    })),
  ),
});

export const { name, reducer } = productsFeature;

const { selectAll, selectEntities, selectTotal } = productsAdapter.getSelectors(
  productsFeature.selectProductsState,
);

export const selectProductList = selectAll;
export const selectProductEntities = selectEntities;
export const selectProductCount = selectTotal;
export const selectProductsLoading = productsFeature.selectIsLoading;
export const selectProductsError = productsFeature.selectError;

export const selectSelectedProduct = createSelector(
  selectProductEntities,
  productsFeature.selectSelectedProductId,
  (entities, selectedId) => (selectedId ? (entities[selectedId] ?? null) : null),
);
