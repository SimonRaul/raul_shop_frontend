import { User } from '../types/users.types';
import { Product } from '../types/products.types';
import { CartItem } from '../types/cart-item.types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions, CategoryActions, ProductActions, ShoppingCartActions } from './app.actions';
import { Category } from '../types/product-category.types';

export interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
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
  shoppingCart: {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    isLoading: false,
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
  shoppingCart: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
    error: null,
  },
};

function recalculateCartTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { items, totalItems, totalPrice: Number(totalPrice.toFixed(2)) };
}

export const appFeature = createFeature({
  name: 'app',
  reducer: createReducer(
    initialState,

    on(AuthActions.login, (state) => ({
      ...state,
      auth: { ...state.auth, isLoading: true, error: null },
    })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
      ...state,
      auth: { ...state.auth, user, token, isLoading: false, error: null },
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      auth: { ...state.auth, isLoading: false, error },
    })),
    on(AuthActions.logout, AuthActions.sessionInvalid, (state) => ({
      ...state,
      auth: { user: null, token: null, isLoading: false, error: null },
    })),
    on(AuthActions.sessionValid, (state, { user }) => ({
      ...state,
      auth: { ...state.auth, user, isLoading: false },
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
      products: { ...state.products, isLoading: true, error: null },
    })),
    on(ProductActions.loadSingleProductSuccess, (state, { product }) => ({
      ...state,
      products: { ...state.products, selectedProduct: product, isLoading: false },
    })),

    on(CategoryActions.loadCategories, (state) => ({
      ...state,
      categories: { ...state.categories, isLoading: true, error: null },
    })),
    on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
      ...state,
      categories: { ...state.categories, list: categories, isLoading: false },
    })),

    on(ShoppingCartActions.addToCart, (state, { productId, quantity }) => {
      const product =
        state.products.list.find((p) => p.id === productId) || state.products.selectedProduct;
      if (!product) return state;

      const existingItem = state.shoppingCart.items.find((i) => i.product.id === productId);
      const newItems = existingItem
        ? state.shoppingCart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...state.shoppingCart.items, { product, quantity }];

      return {
        ...state,
        shoppingCart: { ...state.shoppingCart, ...recalculateCartTotals(newItems) },
      };
    }),
    on(ShoppingCartActions.removeFromCart, (state, { productId }) => {
      const newItems = state.shoppingCart.items.filter((i) => i.product.id !== productId);
      return {
        ...state,
        shoppingCart: { ...state.shoppingCart, ...recalculateCartTotals(newItems) },
      };
    }),
    on(ShoppingCartActions.clearCart, ShoppingCartActions.checkoutSuccess, (state) => ({
      ...state,
      shoppingCart: { items: [], totalItems: 0, totalPrice: 0, isLoading: false, error: null },
    })),
    on(ShoppingCartActions.checkout, (state) => ({
      ...state,
      shoppingCart: { ...state.shoppingCart, isLoading: true, error: null },
    })),
  ),
});

export const {
  name,
  reducer,
  selectAppState,
  selectAuth,
  selectProducts,
  selectCategories,
  selectShoppingCart,
} = appFeature;
