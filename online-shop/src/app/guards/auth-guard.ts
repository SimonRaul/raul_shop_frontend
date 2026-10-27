import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  if (authService.hasValidSession()) {
    return authService.validateSession().pipe(
      map((isValid) => {
        if (isValid) {
          return true;
        }
        authService.logout();
        return router.createUrlTree(['/login']);
      }),
    );
  }

  authService.logout();
  return router.createUrlTree(['/login']);
};
