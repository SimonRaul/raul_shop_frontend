import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../services/auth.service';
import { ShoppingCartService } from '../../../features/shared/shopping-cart/services/shopping-cart.service';
import { Router } from '@angular/router';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
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
}
