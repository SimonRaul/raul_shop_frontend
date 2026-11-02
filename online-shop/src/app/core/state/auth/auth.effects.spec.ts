import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ShoppingCartService } from '../../../features/shared/shopping-cart/services/shopping-cart.service';
import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$: Subject<unknown>;
  let effects: AuthEffects;
  let authService: {
    login: ReturnType<typeof vi.fn>;
    getToken: ReturnType<typeof vi.fn>;
    hasValidSession: ReturnType<typeof vi.fn>;
    validateSession: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let shoppingCartService: { clearCart: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    actions$ = new Subject();
    authService = {
      login: vi.fn(),
      getToken: vi.fn(),
      hasValidSession: vi.fn(),
      validateSession: vi.fn(),
      logout: vi.fn(),
    };
    shoppingCartService = { clearCart: vi.fn() };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        { provide: Actions, useValue: actions$ },
        { provide: AuthService, useValue: authService },
        { provide: ShoppingCartService, useValue: shoppingCartService },
        { provide: Router, useValue: router },
      ],
    });
    effects = TestBed.inject(AuthEffects);
  });

  afterEach(() => actions$.complete());

  async function dispatchAndRead<T>(effect$: import('rxjs').Observable<T>, action: unknown) {
    const result = firstValueFrom(effect$);
    actions$.next(action);
    return result;
  }

  it('maps successful and failed login actions', async () => {
    const request = { username: 'jane', password: 'password' };
    authService.login.mockReturnValue(of({ user: { id: '1' }, token: 'token' }));
    await expect(dispatchAndRead(effects.login$, AuthActions.login({ request }))).resolves.toEqual(
      AuthActions.loginSuccess({ user: { id: '1' } as never, token: 'token' }),
    );

    authService.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));
    await expect(dispatchAndRead(effects.login$, AuthActions.login({ request }))).resolves.toEqual(
      AuthActions.loginFailure({ error: 'Invalid credentials' }),
    );
  });

  it('validates sessions and handles invalid session branches', async () => {
    authService.getToken.mockReturnValue(null);
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());

    authService.getToken.mockReturnValue('token');
    authService.hasValidSession.mockReturnValue(false);
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());

    authService.hasValidSession.mockReturnValue(true);
    authService.validateSession.mockReturnValue(of({ id: '1' }));
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionValid({ user: { id: '1' } as never, token: 'token' }));

    authService.validateSession.mockReturnValue(throwError(() => new Error('Expired')));
    await expect(
      dispatchAndRead(effects.validateSession$, AuthActions.validateSession()),
    ).resolves.toEqual(AuthActions.sessionInvalid());
  });

  it('clears failed and invalid sessions, and logs out to the login page', () => {
    const failedSubscription = effects.clearFailedLogin$.subscribe();
    actions$.next(AuthActions.loginFailure({ error: 'Failed' }));
    expect(authService.logout).toHaveBeenCalledTimes(1);
    failedSubscription.unsubscribe();

    const invalidSubscription = effects.clearInvalidSession$.subscribe();
    actions$.next(AuthActions.sessionInvalid());
    expect(authService.logout).toHaveBeenCalledTimes(2);
    expect(shoppingCartService.clearCart).toHaveBeenCalledTimes(1);
    invalidSubscription.unsubscribe();

    const logoutSubscription = effects.logout$.subscribe();
    actions$.next(AuthActions.logout());
    expect(authService.logout).toHaveBeenCalledTimes(3);
    expect(shoppingCartService.clearCart).toHaveBeenCalledTimes(2);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    logoutSubscription.unsubscribe();
  });

  it('redirects after successful login', () => {
    const subscription = effects.loginSuccessRedirect$.subscribe();
    actions$.next(AuthActions.loginSuccess({ user: {} as never, token: 'token' }));
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    subscription.unsubscribe();
  });
});
