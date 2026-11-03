import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { filter, map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../features/auth/state/auth.reducers';
import { AuthActions } from '../../features/auth/state/auth.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  const authState = store.selectSignal(selectAuthState)();

  if (authState.user) {
    return true;
  }

  const loginRedirect = router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  if (!authService.hasValidSession()) {
    store.dispatch(AuthActions.sessionInvalid());
    return loginRedirect;
  }

  if (!authState.isLoading) {
    store.dispatch(AuthActions.validateSession());
  }

  return store.select(selectAuthState).pipe(
    filter((auth) => auth.isInitialized && !auth.isLoading),
    take(1),
    map((auth) => (auth.user ? true : loginRedirect)),
  );
};
