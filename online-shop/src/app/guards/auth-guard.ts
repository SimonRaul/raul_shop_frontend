import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../core/state/auth/auth.reducers';
import { AuthActions } from '../core/state/auth/auth.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  const authState = store.selectSignal(selectAuthState)();

  if (authState.user) {
    return true;
  }

  if (!authService.hasValidSession()) {
    store.dispatch(AuthActions.sessionInvalid());
    return router.createUrlTree(['/login']);
  }

  if (!authState.isLoading) {
    store.dispatch(AuthActions.validateSession());
  }

  return store.select(selectAuthState).pipe(
    filter((auth) => auth.isInitialized && !auth.isLoading),
    take(1),
    map((auth) => (auth.user ? true : router.createUrlTree(['/login']))),
  );
};
