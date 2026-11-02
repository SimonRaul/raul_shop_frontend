import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { AuthActions } from '../core/state/auth/auth.actions';
import { selectAuthState } from '../core/state/auth/auth.reducers';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const auth = store.selectSignal(selectAuthState)();

  if (auth.user) {
    return router.createUrlTree(['/products']);
  }

  if (!authService.hasValidSession()) {
    return true;
  }

  if (!auth.isLoading) {
    store.dispatch(AuthActions.validateSession());
  }

  return store.select(selectAuthState).pipe(
    filter((state) => state.isInitialized && !state.isLoading),
    take(1),
    map((state) => (state.user ? router.createUrlTree(['/products']) : true)),
  );
};
