import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuth } from '../features/shared/state/app.reducers';
import { hasUserRole, UserRole } from '../features/shared/types/users.types';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const user = store.selectSignal(selectAuth)().user;

  return hasUserRole(user, UserRole.ADMIN) ? true : router.createUrlTree(['/products']);
};
