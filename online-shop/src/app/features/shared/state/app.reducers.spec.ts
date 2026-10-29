import { AuthActions, CategoryActions, ProductActions } from './app.actions';
import { AppState, reducer } from './app.reducers';
import { Category } from '../types/product-category.types';
import { Product } from '../types/products.types';
import { User } from '../types/users.types';

describe('appReducer', () => {
  const user: User = {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    username: 'jane',
    role: 'CUSTOMER',
  };
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
  const category: Category = {
    id: 'category-1',
    name: 'Furniture',
    description: 'Furniture products',
  };

  let initialState: AppState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@init' });
  });

  it('returns the initial state', () => {
    expect(initialState).toEqual({
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
    });
  });

  it('updates authentication state for login and session actions', () => {
    let state = reducer(
      initialState,
      AuthActions.login({ request: { username: 'jane', password: 'password' } }),
    );
    expect(state.auth).toMatchObject({ isLoading: true, error: null });

    state = reducer(state, AuthActions.loginSuccess({ user, token: 'token' }));
    expect(state.auth).toEqual({
      user,
      token: 'token',
      isLoading: false,
      isInitialized: true,
      error: null,
    });

    state = reducer(state, AuthActions.loginFailure({ error: 'Invalid credentials' }));
    expect(state.auth).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: 'Invalid credentials',
    });

    state = reducer(state, AuthActions.validateSession());
    expect(state.auth).toMatchObject({ isLoading: true, error: null });
    state = reducer(state, AuthActions.sessionValid({ user, token: 'new-token' }));
    expect(state.auth).toMatchObject({ user, token: 'new-token', isInitialized: true });

    state = reducer(state, AuthActions.sessionInvalid());
    expect(state.auth).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  });

  it('clears authentication state on logout', () => {
    const state = reducer(
      { ...initialState, auth: { ...initialState.auth, user, token: 'token' } },
      AuthActions.logout(),
    );

    expect(state.auth).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  });

  it('loads products and handles product errors', () => {
    let state = reducer(initialState, ProductActions.loadProducts());
    expect(state.products).toMatchObject({ isLoading: true, error: null });

    state = reducer(state, ProductActions.loadProductsSuccess({ products: [product] }));
    expect(state.products).toMatchObject({ list: [product], isLoading: false });

    state = reducer(state, ProductActions.loadProductsFailure({ error: 'Unable to load' }));
    expect(state.products).toMatchObject({ isLoading: false, error: 'Unable to load' });
  });

  it('loads, replaces, and clears a selected product', () => {
    let state = reducer(initialState, ProductActions.loadSingleProduct({ productId: product.id }));
    expect(state.products).toMatchObject({
      selectedProduct: null,
      isLoading: true,
      error: null,
    });

    state = reducer(state, ProductActions.loadSingleProductSuccess({ product }));
    expect(state.products).toMatchObject({ selectedProduct: product, isLoading: false });

    state = reducer(state, ProductActions.loadSingleProductFailure({ error: 'Not found' }));
    expect(state.products).toMatchObject({
      selectedProduct: null,
      isLoading: false,
      error: 'Not found',
    });

    state = reducer(
      { ...initialState, products: { ...initialState.products, selectedProduct: product } },
      ProductActions.clearSelectedProduct(),
    );
    expect(state.products).toMatchObject({ selectedProduct: null, error: null });
  });

  it('adds, updates, and deletes products', () => {
    let state = reducer(
      { ...initialState, products: { ...initialState.products, list: [product] } },
      ProductActions.addProduct({
        product: {
          name: product.name,
          description: product.description,
          price: product.price,
          weight: product.weight,
          categoryId: 'category-1',
          imageUrl: product.imageUrl,
        },
      }),
    );
    expect(state.products).toMatchObject({ isLoading: true, error: null });

    state = reducer(state, ProductActions.addProductSuccess({ product }));
    expect(state.products).toMatchObject({
      list: [product, product],
      selectedProduct: product,
      isLoading: false,
      error: null,
    });

    state = reducer(state, ProductActions.updateProductSuccess({ product: replacementProduct }));
    expect(state.products.list).toEqual([replacementProduct, replacementProduct]);
    expect(state.products.selectedProduct).toEqual(replacementProduct);

    state = reducer(state, ProductActions.deleteProductSuccess({ productId: product.id }));
    expect(state.products).toMatchObject({
      list: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
    });

    state = reducer(state, ProductActions.addProductFailure({ error: 'Save failed' }));
    expect(state.products).toMatchObject({ isLoading: false, error: 'Save failed' });
  });

  it('updates category loading, success, and failure state', () => {
    let state = reducer(initialState, CategoryActions.loadCategories());
    expect(state.categories).toMatchObject({ isLoading: true, error: null });

    state = reducer(state, CategoryActions.loadCategoriesSuccess({ categories: [category] }));
    expect(state.categories).toMatchObject({ list: [category], isLoading: false });

    state = reducer(state, CategoryActions.loadCategoriesFailure({ error: 'Unable to load' }));
    expect(state.categories).toMatchObject({ isLoading: false, error: 'Unable to load' });
  });
});
