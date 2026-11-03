import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore, Store } from '@ngrx/store';
import { firstValueFrom, throwError } from 'rxjs';
import { AuthEffects } from '../core/state/auth/auth.effects';
import { AuthActions } from '../core/state/auth/auth.actions';
import { authFeature, selectAuthState } from '../core/state/auth/auth.reducers';
import { ShoppingCartService } from '../features/shared/shopping-cart/services/shopping-cart.service';
import { User } from '../features/shared/types/users.types';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  const user: User = {
    id: '11111-11111-11111-11111',
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    username: 'tester',
    role: 'CUSTOMER',
  };

  let store: Store;
  let authService: { logout: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { logout: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideState(authFeature),
        provideEffects(AuthEffects),
        { provide: AuthService, useValue: authService },
        { provide: ShoppingCartService, useValue: { clearCart: vi.fn() } },
        { provide: Router, useValue: router },
      ],
    });

    store = TestBed.inject(Store);
    store.dispatch(AuthActions.sessionValid({ user, token: 'token' }));
  });

  it('clears the session and redirects to login and throws the original 401 error', async () => {
    const error = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      url: '/api/products',
    });
    const request = new HttpRequest('GET', '/api/products');

    const response = TestBed.runInInjectionContext(() =>
      firstValueFrom(authInterceptor(request, () => throwError(() => error))),
    );

    await expect(response).rejects.toBe(error);
    expect(store.selectSignal(selectAuthState)()).toMatchObject({
      user: null,
      token: null,
      isInitialized: true,
    });
    expect(authService.logout).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
