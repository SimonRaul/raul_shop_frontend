import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductsService } from '../services/products.service';
import { CategoryActions, ProductActions } from './products.actions';
import { ProductsEffects } from './products.effects';
import { Product } from '../types/products.types';

describe('ProductsEffects', () => {
  let actions$: Subject<unknown>;
  let effects: ProductsEffects;
  let productsService: {
    getAllProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };
  let categoryService: { getAllCategories: ReturnType<typeof vi.fn> };
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
    productsService = {
      getAllProducts: vi.fn(),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    };
    categoryService = { getAllCategories: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ProductsEffects,
        { provide: Actions, useValue: actions$ },
        { provide: ProductsService, useValue: productsService },
        { provide: ProductCategoryService, useValue: categoryService },
        { provide: Router, useValue: router },
      ],
    });
    effects = TestBed.inject(ProductsEffects);
  });

  afterEach(() => actions$.complete());

  async function dispatchAndRead<T>(effect$: import('rxjs').Observable<T>, action: unknown) {
    const result = firstValueFrom(effect$);
    actions$.next(action);
    return result;
  }

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

  it('redirects after successful product mutations', () => {
    const subscription = effects.productFormSuccessRedirect$.subscribe();
    actions$.next(ProductActions.addProductSuccess({ product }));
    actions$.next(ProductActions.updateProductSuccess({ product }));
    actions$.next(ProductActions.deleteProductSuccess({ productId: product.id }));
    expect(router.navigate).toHaveBeenCalledTimes(3);
    expect(router.navigate).toHaveBeenLastCalledWith(['/products']);
    subscription.unsubscribe();
  });
});
