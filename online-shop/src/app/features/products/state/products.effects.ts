import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductsService } from '../../../services/products.service';
import { ProductCategoryService } from '../../../services/product-category.service';
import { Router } from '@angular/router';
import { CategoryActions, ProductActions } from './products.actions';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(ProductCategoryService);
  private readonly router = inject(Router);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productsService.getAllProducts().pipe(
          map((products) => ProductActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadSingleProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadSingleProduct),
      switchMap(({ productId }) =>
        this.productsService.getProductById(productId).pipe(
          map((product) => ProductActions.loadSingleProductSuccess({ product })),
          catchError((error) =>
            of(ProductActions.loadSingleProductFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.addProduct),
      concatMap(({ product }) =>
        this.productsService.createProduct(product).pipe(
          map((newProduct) => ProductActions.addProductSuccess({ product: newProduct })),
          catchError((error) => of(ProductActions.addProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.updateProduct),
      concatMap(({ productId, productData }) =>
        this.productsService.updateProduct(productId, productData).pipe(
          map((updatedProduct) => ProductActions.updateProductSuccess({ product: updatedProduct })),
          catchError((error) => of(ProductActions.updateProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      concatMap(({ productId }) =>
        this.productsService.deleteProduct(productId).pipe(
          map(() => ProductActions.deleteProductSuccess({ productId })),
          catchError((error) => of(ProductActions.deleteProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  productFormSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ProductActions.addProductSuccess,
          ProductActions.updateProductSuccess,
          ProductActions.deleteProductSuccess,
        ),
        tap(() => this.router.navigate(['/products'])),
      ),
    { dispatch: false },
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap(() =>
        this.categoryService.getAllCategories().pipe(
          map((categories) => CategoryActions.loadCategoriesSuccess({ categories })),
          catchError((error) =>
            of(CategoryActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
