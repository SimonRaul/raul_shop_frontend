import { User } from '../types/users.types';
import { Product } from '../types/products.types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions, CategoryActions, ProductActions } from './app.actions';
import { Category } from '../types/product-category.types';

export interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
  };
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

const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
    error: null,
  },
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

export const appFeature = createFeature({
  name: 'app',
  reducer: createReducer(
    initialState,

    on(AuthActions.login, (state) => ({
      ...state,
      auth: { ...state.auth, isLoading: true, error: null },
    })),
    on(AuthActions.validateSession, (state) => ({
      ...state,
      auth: { ...state.auth, isLoading: true, error: null },
    })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
      ...state,
      auth: { user, token, isLoading: false, isInitialized: true, error: null },
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      auth: {
        ...state.auth,
        user: null,
        token: null,
        isLoading: false,
        isInitialized: true,
        error,
      },
    })),
    on(AuthActions.logout, AuthActions.sessionInvalid, (state) => ({
      ...state,
      auth: { user: null, token: null, isLoading: false, isInitialized: true, error: null },
    })),
    on(AuthActions.sessionValid, (state, { user, token }) => ({
      ...state,
      auth: { user, token, isLoading: false, isInitialized: true, error: null },
    })),

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

export const { name, reducer, selectAppState, selectAuth, selectProducts, selectCategories } =
  appFeature;
