import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ShoppingCartService } from '../shopping-cart/services/shopping-cart.service';
import { Router } from '@angular/router';
import { AuthActions, ProductActions, CategoryActions } from './app.actions';
import { catchError, map, switchMap, tap, of } from 'rxjs';

@Injectable()
export class AppEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly productsService = inject(ProductsService);
  private readonly categoryService = inject(ProductCategoryService);
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  validateSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.validateSession),
      switchMap(() => {
        const token = this.authService.getToken();

        if (!token || !this.authService.hasValidSession()) {
          return of(AuthActions.sessionInvalid());
        }

        return this.authService.validateSession().pipe(
          map((user) => AuthActions.sessionValid({ user, token })),
          catchError(() => of(AuthActions.sessionInvalid())),
        );
      }),
    ),
  );

  clearFailedLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(() => this.authService.logout()),
      ),
    { dispatch: false },
  );

  clearInvalidSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionInvalid),
        tap(() => {
          this.authService.logout();
          this.shoppingCartService.clearCart();
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.shoppingCartService.clearCart();
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
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

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap(({ productId }) =>
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
