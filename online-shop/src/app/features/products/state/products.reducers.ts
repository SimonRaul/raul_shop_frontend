import { Product } from '../../shared/types/products.types';
import { Category } from '../../shared/types/product-category.types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoryActions, ProductActions } from './products.actions';

export interface ProductsState {
  products: {
    list: Product[];
    selectedProduct: Product | null;
    isLoading: boolean;
    error: string | null;
  };
  categories: {
    list: Category[];
    isLoading: boolean;
    error: string | null;
  };
}

export const initialProductsState: ProductsState = {
  products: {
    list: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  },
  categories: {
    list: [],
    isLoading: false,
    error: null,
  },
};

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialProductsState,

    on(ProductActions.loadProducts, (state) => ({
      ...state,
      products: { ...state.products, isLoading: true, error: null },
    })),
    on(ProductActions.loadProductsSuccess, (state, { products }) => ({
      ...state,
      products: { ...state.products, list: products, isLoading: false },
    })),
    on(ProductActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      products: { ...state.products, isLoading: false, error },
    })),
    on(ProductActions.loadSingleProduct, (state) => ({
      ...state,
      products: { ...state.products, selectedProduct: null, isLoading: true, error: null },
    })),
    on(ProductActions.loadSingleProductSuccess, (state, { product }) => ({
      ...state,
      products: { ...state.products, selectedProduct: product, isLoading: false },
    })),
    on(ProductActions.loadSingleProductFailure, (state, { error }) => ({
      ...state,
      products: { ...state.products, selectedProduct: null, isLoading: false, error },
    })),
    on(
      ProductActions.addProduct,
      ProductActions.updateProduct,
      ProductActions.deleteProduct,
      (state) => ({
        ...state,
        products: { ...state.products, isLoading: true, error: null },
      }),
    ),
    on(ProductActions.addProductSuccess, (state, { product }) => ({
      ...state,
      products: {
        ...state.products,
        list: [...state.products.list, product],
        selectedProduct: product,
        isLoading: false,
        error: null,
      },
    })),
    on(ProductActions.updateProductSuccess, (state, { product }) => ({
      ...state,
      products: {
        ...state.products,
        list: state.products.list.map((item) => (item.id === product.id ? product : item)),
        selectedProduct: product,
        isLoading: false,
        error: null,
      },
    })),
    on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
      ...state,
      products: {
        ...state.products,
        list: state.products.list.filter((product) => product.id !== productId),
        selectedProduct: null,
        isLoading: false,
        error: null,
      },
    })),
    on(
      ProductActions.addProductFailure,
      ProductActions.updateProductFailure,
      ProductActions.deleteProductFailure,
      (state, { error }) => ({
        ...state,
        products: { ...state.products, isLoading: false, error },
      }),
    ),
    on(ProductActions.clearSelectedProduct, (state) => ({
      ...state,
      products: { ...state.products, selectedProduct: null, error: null },
    })),

    on(CategoryActions.loadCategories, (state) => ({
      ...state,
      categories: { ...state.categories, isLoading: true, error: null },
    })),
    on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
      ...state,
      categories: { ...state.categories, list: categories, isLoading: false },
    })),
    on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
      ...state,
      categories: { ...state.categories, isLoading: false, error },
    })),
  ),
});

export const { name, reducer, selectProducts, selectCategories } = productsFeature;
