import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { AuthActions } from '../../features/auth/state/auth.actions';
import {
  selectIsInitialized,
  selectIsLoading,
  selectUser,
} from '../../features/auth/state/auth.reducers';
import { AuthService } from '../../features/auth/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = store.selectSignal(selectUser)();
  const isLoading = store.selectSignal(selectIsLoading)();

  if (user) {
    return router.createUrlTree(['/products']);
  }

  if (!authService.hasValidSession()) {
    return true;
  }

  if (!isLoading) {
    store.dispatch(AuthActions.validateSession());
  }

  return combineLatest([
    store.select(selectUser),
    store.select(selectIsLoading),
    store.select(selectIsInitialized),
  ]).pipe(
    filter(([, loading, initialized]) => initialized && !loading),
    take(1),
    map(([validatedUser]) => (validatedUser ? router.createUrlTree(['/products']) : true)),
  );
};
