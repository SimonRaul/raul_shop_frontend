import { provideLocationMocks } from '@angular/common/testing';
import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideState, provideStore, Store } from '@ngrx/store';
import { routes } from './app.routes';
import { AuthActions } from './core/state/auth/auth.actions';
import { authFeature } from './core/state/auth/auth.reducers';
import { User, UserRole } from './features/shared/types/users.types';
import { AuthService } from './services/auth.service';

@Component({ selector: 'app-stub-product-list', template: 'product list' })
class ProductListStubComponent {}

@Component({ selector: 'app-stub-product-details', template: 'product details' })
class ProductDetailsStubComponent {}

@Component({ selector: 'app-stub-product-form', template: 'product form' })
class ProductsFormStubComponent {}

@Component({ selector: 'app-stub-shopping-cart', template: 'shopping cart' })
class ShoppingCartStubComponent {}

@Component({ selector: 'app-stub-checkout', template: 'checkout' })
class CheckoutStubComponent {}

@Component({ selector: 'app-stub-profile', template: 'profile' })
class ProfileStubComponent {}

@Component({ selector: 'app-stub-login', template: 'login' })
class LoginStubComponent {}

@Component({ selector: 'app-stub-not-found', template: 'not found' })
class NotFoundStubComponent {}

const componentStubs: Record<string, Type<unknown>> = {
  'products/new': ProductsFormStubComponent,
  'products/:id': ProductDetailsStubComponent,
  products: ProductListStubComponent,
  'shopping-cart': ShoppingCartStubComponent,
  checkout: CheckoutStubComponent,
  'products/:id/edit': ProductsFormStubComponent,
  profile: ProfileStubComponent,
  login: LoginStubComponent,
  '**': NotFoundStubComponent,
};

const testRoutes: Routes = routes.map((route) =>
  route.component ? { ...route, component: componentStubs[route.path ?? ''] } : { ...route },
);

const customer: User = {
  id: 'user-1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  username: 'ada',
  role: 'ROLE_CUSTOMER',
};

const admin: User = { ...customer, id: 'user-2', username: 'root', role: `ROLE_${UserRole.ADMIN}` };

describe('app routes', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let store: Store;
  let hasValidSession: ReturnType<typeof vi.fn>;

  const signIn = (user: User): void => {
    hasValidSession.mockReturnValue(true);
    store.dispatch(AuthActions.loginSuccess({ user, token: 'token' }));
  };

  beforeEach(async () => {
    hasValidSession = vi.fn().mockReturnValue(false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter(testRoutes),
        provideLocationMocks(),
        provideStore(),
        provideState(authFeature),
        { provide: AuthService, useValue: { hasValidSession } },
      ],
    });

    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
  });

  it('declares a stub for every configured route component', () => {
    const missing = routes.filter((route) => route.component && !componentStubs[route.path ?? '']);

    expect(missing).toEqual([]);
  });

  describe('unauthenticated users', () => {
    const protectedUrls = [
      '/products',
      '/products/product-1',
      '/products/new',
      '/products/product-1/edit',
      '/shopping-cart',
      '/checkout',
      '/profile',
    ];

    it.each(protectedUrls)('redirects %s to the login page with a return url', async (url) => {
      await harness.navigateByUrl(url);

      expect(router.url).toBe(`/login?returnUrl=${encodeURIComponent(url)}`);
      expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(LoginStubComponent);
    });

    it('clears an invalid session before redirecting', async () => {
      const dispatch = vi.spyOn(store, 'dispatch');

      await harness.navigateByUrl('/profile');

      expect(dispatch).toHaveBeenCalledWith(AuthActions.sessionInvalid());
    });

    it('renders the login page', async () => {
      const component = await harness.navigateByUrl('/login');

      expect(router.url).toBe('/login');
      expect(component).toBeInstanceOf(LoginStubComponent);
    });

    it('waits for an in-flight session validation before granting access', async () => {
      hasValidSession.mockReturnValue(true);

      const navigation = harness.navigateByUrl('/profile');
      setTimeout(() =>
        store.dispatch(AuthActions.sessionValid({ user: customer, token: 'token' })),
      );

      const component = await navigation;

      expect(router.url).toBe('/profile');
      expect(component).toBeInstanceOf(ProfileStubComponent);
    });

    it('keeps the login redirect when session validation fails', async () => {
      hasValidSession.mockReturnValue(true);

      const navigation = harness.navigateByUrl('/profile');
      setTimeout(() => {
        hasValidSession.mockReturnValue(false);
        store.dispatch(AuthActions.loginFailure({ error: 'expired' }));
      });

      const component = await navigation;

      expect(router.url).toBe('/login?returnUrl=%2Fprofile');
      expect(component).toBeInstanceOf(LoginStubComponent);
    });
  });

  describe('authenticated customers', () => {
    beforeEach(() => signIn(customer));

    it('redirects the empty path to the product list', async () => {
      const component = await harness.navigateByUrl('/');

      expect(router.url).toBe('/products');
      expect(component).toBeInstanceOf(ProductListStubComponent);
    });

    it.each([
      ['/products', ProductListStubComponent],
      ['/products/product-1', ProductDetailsStubComponent],
      ['/shopping-cart', ShoppingCartStubComponent],
      ['/checkout', CheckoutStubComponent],
      ['/profile', ProfileStubComponent],
    ])('grants access to %s', async (url, expected) => {
      const component = await harness.navigateByUrl(url as string);

      expect(router.url).toBe(url);
      expect(component).toBeInstanceOf(expected as Type<unknown>);
    });

    it.each(['/products/new', '/products/product-1/edit'])(
      'redirects %s to the product list',
      async (url) => {
        const component = await harness.navigateByUrl(url);

        expect(router.url).toBe('/products');
        expect(component).toBeInstanceOf(ProductListStubComponent);
      },
    );

    it('redirects the login page back to the product list', async () => {
      const component = await harness.navigateByUrl('/login');

      expect(router.url).toBe('/products');
      expect(component).toBeInstanceOf(ProductListStubComponent);
    });
  });

  describe('authenticated administrators', () => {
    beforeEach(() => signIn(admin));

    it('renders the create-product form', async () => {
      const component = await harness.navigateByUrl('/products/new');

      expect(router.url).toBe('/products/new');
      expect(component).toBeInstanceOf(ProductsFormStubComponent);
      expect(router.routerState.snapshot.root.firstChild?.routeConfig?.path).toBe('products/new');
    });

    it('renders the edit-product form with the product id', async () => {
      const component = await harness.navigateByUrl('/products/product-1/edit');

      expect(router.url).toBe('/products/product-1/edit');
      expect(component).toBeInstanceOf(ProductsFormStubComponent);
      expect(router.routerState.snapshot.root.firstChild?.params['id']).toBe('product-1');
    });

    it('redirects the login page back to the product list', async () => {
      await harness.navigateByUrl('/login');

      expect(router.url).toBe('/products');
    });
  });

  describe('unknown routes', () => {
    it.each(['/does-not-exist', '/products/product-1/unknown', '/checkout/extra'])(
      'renders the not found page for %s',
      async (url) => {
        signIn(customer);

        const component = await harness.navigateByUrl(url);

        expect(router.url).toBe(url);
        expect(component).toBeInstanceOf(NotFoundStubComponent);
      },
    );

    it('renders the not found page for unauthenticated users without redirecting', async () => {
      const component = await harness.navigateByUrl('/does-not-exist');

      expect(router.url).toBe('/does-not-exist');
      expect(component).toBeInstanceOf(NotFoundStubComponent);
    });
  });
});
