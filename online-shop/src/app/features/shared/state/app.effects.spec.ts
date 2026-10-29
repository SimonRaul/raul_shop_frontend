import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ProductsService } from '../../../services/products.service';
import { ShoppingCartService } from '../shopping-cart/services/shopping-cart.service';
import { AuthActions, CategoryActions, ProductActions } from './app.actions';
import { AppEffects } from './app.effects';
import { Product } from '../types/products.types';

describe('AppEffects', () => {
  let actions$: Subject<unknown>;
  let effects: AppEffects;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    getToken: ReturnType<typeof vi.fn>;
    hasValidSession: ReturnType<typeof vi.fn>;
    validateSession: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let productsService: {
    getAllProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };
  let categoryService: { getAllCategories: ReturnType<typeof vi.fn> };
  let shoppingCartService: { clearCart: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

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
  const productData = {
    name: 'Chair',
    description: 'A chair',
    price: 25,
    weight: 4,
    categoryId: 'category-1',
    imageUrl: 'chair.jpg',
  };

  beforeEach(() => {
    actions$ = new Subject();
    authService = {
      login: vi.fn(),
      getToken: vi.fn(),
      hasValidSession: vi.fn(),
      validateSession: vi.fn(),
      logout: vi.fn(),
    };
    productsService = {
      getAllProducts: vi.fn(),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    };
    categoryService = { getAllCategories: vi.fn() };
    shoppingCartService = { clearCart: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        { provide: Actions, useValue: actions$ },
        { provide: AuthService, useValue: authService },
        { provide: ProductsService, useValue: productsService },
        { provide: ProductCategoryService, useValue: categoryService },
        { provide: ShoppingCartService, useValue: shoppingCartService },
        { provide: Router, useValue: router },
      ],
    });
    effects = TestBed.inject(AppEffects);
  });

  afterEach(() => actions$.complete());

  async function dispatchAndRead<T>(effect$: import('rxjs').Observable<T>, action: unknown) {
    const result = firstValueFrom(effect$);
    actions$.next(action);
    return result;
  }

  it('maps successful and failed login actions', async () => {
    const request = { username: 'jane', password: 'password' };
    authService.login.mockReturnValue(of({ user: { id: '1' }, token: 'token' }));
    await expect(dispatchAndRead(effects.login$, AuthActions.login({ request }))).resolves.toEqual(
      AuthActions.loginSuccess({ user: { id: '1' } as never, token: 'token' }),
    );

    authService.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));
    await expect(dispatchAndRead(effects.login$, AuthActions.login({ request }))).resolves.toEqual(
      AuthActions.loginFailure({ error: 'Invalid credentials' }),
    );
  });

  it('validates sessions and handles invalid session branches', async () => {
    authService.getToken.mockReturnValue(null);
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());

    authService.getToken.mockReturnValue('token');
    authService.hasValidSession.mockReturnValue(false);
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());

    authService.hasValidSession.mockReturnValue(true);
    authService.validateSession.mockReturnValue(of({ id: '1' }));
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionValid({ user: { id: '1' } as never, token: 'token' }));

    authService.validateSession.mockReturnValue(throwError(() => new Error('Expired')));
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());
  });

  it('clears failed and invalid sessions, and logs out to the login page', () => {
    const failedSubscription = effects.clearFailedLogin$.subscribe();
    actions$.next(AuthActions.loginFailure({ error: 'Failed' }));
    expect(authService.logout).toHaveBeenCalledTimes(1);
    failedSubscription.unsubscribe();

    const invalidSubscription = effects.clearInvalidSession$.subscribe();
    actions$.next(AuthActions.sessionInvalid());
    expect(authService.logout).toHaveBeenCalledTimes(2);
    expect(shoppingCartService.clearCart).toHaveBeenCalledTimes(1);
    invalidSubscription.unsubscribe();

    const logoutSubscription = effects.logout$.subscribe();
    actions$.next(AuthActions.logout());
    expect(authService.logout).toHaveBeenCalledTimes(3);
    expect(shoppingCartService.clearCart).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    logoutSubscription.unsubscribe();
  });

  it('redirects after successful login and product mutations', () => {
    const loginSubscription = effects.loginSuccessRedirect$.subscribe();
    actions$.next(AuthActions.loginSuccess({ user: {} as never, token: 'token' }));
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    loginSubscription.unsubscribe();

    const productSubscription = effects.productFormSuccessRedirect$.subscribe();
    actions$.next(ProductActions.addProductSuccess({ product }));
    actions$.next(ProductActions.updateProductSuccess({ product }));
    actions$.next(ProductActions.deleteProductSuccess({ productId: product.id }));
    expect(router.navigate).toHaveBeenCalledTimes(4);
    expect(router.navigate).toHaveBeenLastCalledWith(['/products']);
    productSubscription.unsubscribe();
  });

  it('loads products and maps product operation successes and failures', async () => {
    productsService.getAllProducts.mockReturnValue(of([product]));
    await expect(
      dispatchAndRead(effects.loadProducts$, ProductActions.loadProducts()),
    ).resolves.toEqual(ProductActions.loadProductsSuccess({ products: [product] }));

    productsService.getAllProducts.mockReturnValue(throwError(() => new Error('Load failed')));
    await expect(
      dispatchAndRead(effects.loadProducts$, ProductActions.loadProducts()),
    ).resolves.toEqual(ProductActions.loadProductsFailure({ error: 'Load failed' }));

    productsService.getProductById.mockReturnValue(of(product));
    await expect(
      dispatchAndRead(
        effects.loadSingleProduct$,
        ProductActions.loadSingleProduct({ productId: product.id }),
      ),
    ).resolves.toEqual(ProductActions.loadSingleProductSuccess({ product }));

    productsService.getProductById.mockReturnValue(throwError(() => new Error('Not found')));
    await expect(
      dispatchAndRead(
        effects.loadSingleProduct$,
        ProductActions.loadSingleProduct({ productId: product.id }),
      ),
    ).resolves.toEqual(ProductActions.loadSingleProductFailure({ error: 'Not found' }));

    productsService.createProduct.mockReturnValue(of(product));
    await expect(
      dispatchAndRead(effects.addProduct$, ProductActions.addProduct({ product: productData })),
    ).resolves.toEqual(ProductActions.addProductSuccess({ product }));

    productsService.updateProduct.mockReturnValue(of(product));
    await expect(
      dispatchAndRead(
        effects.updateProduct$,
        ProductActions.updateProduct({ productId: product.id, productData }),
      ),
    ).resolves.toEqual(ProductActions.updateProductSuccess({ product }));

    productsService.deleteProduct.mockReturnValue(of(undefined));
    await expect(
      dispatchAndRead(
        effects.deleteProduct$,
        ProductActions.deleteProduct({ productId: product.id }),
      ),
    ).resolves.toEqual(ProductActions.deleteProductSuccess({ productId: product.id }));
  });

  it('maps product mutation errors', async () => {
    productsService.createProduct.mockReturnValue(throwError(() => new Error('Create failed')));
    productsService.updateProduct.mockReturnValue(throwError(() => new Error('Update failed')));
    productsService.deleteProduct.mockReturnValue(throwError(() => new Error('Delete failed')));

    await expect(
      dispatchAndRead(effects.addProduct$, ProductActions.addProduct({ product: productData })),
    ).resolves.toEqual(ProductActions.addProductFailure({ error: 'Create failed' }));
    await expect(
      dispatchAndRead(
        effects.updateProduct$,
        ProductActions.updateProduct({ productId: product.id, productData }),
      ),
    ).resolves.toEqual(ProductActions.updateProductFailure({ error: 'Update failed' }));
    await expect(
      dispatchAndRead(
        effects.deleteProduct$,
        ProductActions.deleteProduct({ productId: product.id }),
      ),
    ).resolves.toEqual(ProductActions.deleteProductFailure({ error: 'Delete failed' }));
  });

  it('loads categories and maps category errors', async () => {
    const categories = [{ id: 'category-1', name: 'Furniture', description: 'Furniture' }];
    categoryService.getAllCategories.mockReturnValue(of(categories));
    await expect(
      dispatchAndRead(effects.loadCategories$, CategoryActions.loadCategories()),
    ).resolves.toEqual(CategoryActions.loadCategoriesSuccess({ categories }));

    categoryService.getAllCategories.mockReturnValue(
      throwError(() => new Error('Category load failed')),
    );
    await expect(
      dispatchAndRead(effects.loadCategories$, CategoryActions.loadCategories()),
    ).resolves.toEqual(CategoryActions.loadCategoriesFailure({ error: 'Category load failed' }));
  });
});
