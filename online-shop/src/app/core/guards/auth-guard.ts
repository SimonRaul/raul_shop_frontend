import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { combineLatest, filter, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectIsInitialized,
  selectIsLoading,
  selectUser,
} from '../../features/auth/state/auth.reducers';
import { AuthActions } from '../../features/auth/state/auth.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = store.selectSignal(selectUser)();
  const isLoading = store.selectSignal(selectIsLoading)();

  if (user) {
    return true;
  }

  const loginRedirect = router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  if (!authService.hasValidSession()) {
    store.dispatch(AuthActions.sessionInvalid());
    return loginRedirect;
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
    map(([validatedUser]) => (validatedUser ? true : loginRedirect)),
  );
};
