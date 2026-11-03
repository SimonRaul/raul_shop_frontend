import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../features/auth/state/auth.reducers';
import { hasUserRole, UserRole } from '../../features/user/types/users.types';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const user = store.selectSignal(selectUser)();

  return hasUserRole(user, UserRole.ADMIN) ? true : router.createUrlTree(['/products']);
};
