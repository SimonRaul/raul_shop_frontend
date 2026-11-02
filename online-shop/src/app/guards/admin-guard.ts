import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../core/state/auth/auth.reducers';
import { hasUserRole, UserRole } from '../features/shared/types/users.types';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const user = store.selectSignal(selectAuthState)().user;

  return hasUserRole(user, UserRole.ADMIN) ? true : router.createUrlTree(['/products']);
};
