import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ShoppingCartService } from '../shopping-cart/services/shopping-cart.service';
import { Router } from '@angular/router';
import { AuthActions, ProductActions, CategoryActions, ShoppingCartActions } from './app.actions';
import { catchError, map, switchMap, tap, of } from 'rxjs';

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(ProductCategoryService);
  private readonly cartService = inject(ShoppingCartService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((user) => {
            const token = this.authService.getToken() || '';
            return AuthActions.loginSuccess({ user, token });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loginSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/products'])),
      ),
    { dispatch: false },
  );

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
      switchMap(({ product }) =>
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
      switchMap(({ productId, productData }) =>
        this.productsService.updateProduct(productId, productData).pipe(
          map((updatedProduct) => ProductActions.updateProductSuccess({ product: updatedProduct })),
          catchError((error) => of(ProductActions.updateProductFailure({ error: error.message }))),
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
          map((categories) =>
            CategoryActions.loadCategoriesSuccess({ categories: categories as any }),
          ),
          catchError((error) =>
            of(CategoryActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  checkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingCartActions.checkout),
      switchMap(({ checkoutData }) =>
        this.cartService.createOrder(checkoutData).pipe(
          map(() => ShoppingCartActions.checkoutSuccess()),
          catchError((error) => of(ShoppingCartActions.checkoutFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  checkoutSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingCartActions.checkoutSuccess),
        tap(() => this.router.navigate(['/products'])),
      ),
    { dispatch: false },
  );
}
