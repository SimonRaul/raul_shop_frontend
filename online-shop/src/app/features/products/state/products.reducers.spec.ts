import { CategoryActions, ProductActions } from './products.actions';
import { ProductsState, reducer } from './products.reducers';
import { Category } from '../types/product-category.types';
import { Product } from '../types/products.types';

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
  const category: Category = {
    id: 'category-1',
    name: 'Furniture',
    description: 'Furniture products',
  };

  let initialState: ProductsState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@init' });
  });

  it('returns the initial state', () => {
    expect(initialState).toEqual({
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
