import { TestBed } from '@angular/core/testing';
import { Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { firstValueFrom, of, Subject } from 'rxjs';
import { CartActions } from './shopping-cart.actions';
import { ShoppingCartEffects } from './shopping-cart.effects';

describe('ShoppingCartEffects', () => {
  let actions$: Subject<unknown>;
  let effects: ShoppingCartEffects;
  const items = [{ productId: 'product-1', quantity: 2 }];

  beforeEach(() => {
    localStorage.clear();
    actions$ = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ShoppingCartEffects,
        { provide: Actions, useValue: actions$ },
        { provide: Store, useValue: { select: () => of(items) } },
      ],
    });

    effects = TestBed.inject(ShoppingCartEffects);
  });

  afterEach(() => {
    actions$.complete();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  async function dispatchAndRead<T>(effect$: import('rxjs').Observable<T>, action: unknown) {
    const result = firstValueFrom(effect$);
    actions$.next(action);
    return result;
  }

  it('requests cart hydration when root effects initialize', async () => {
    await expect(
      dispatchAndRead(effects.initializeCart$, { type: ROOT_EFFECTS_INIT }),
    ).resolves.toEqual(CartActions.loadCart());
  });

  it('loads and normalizes persisted cart items', async () => {
    localStorage.setItem(
      'shopping_cart_data',
      JSON.stringify({ items: [{ productId: 'product-1', quantity: '2' }] }),
    );

    await expect(dispatchAndRead(effects.loadCart$, CartActions.loadCart())).resolves.toEqual(
      CartActions.loadCartSuccess({ items }),
    );
  });

  it('clears invalid persisted data and reports a hydration failure', async () => {
    localStorage.setItem('shopping_cart_data', JSON.stringify({ items: [{}] }));
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(dispatchAndRead(effects.loadCart$, CartActions.loadCart())).resolves.toEqual(
      CartActions.loadCartFailure({
        error: 'The saved shopping cart was invalid and has been cleared.',
      }),
    );
    expect(localStorage.getItem('shopping_cart_data')).toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('persists the latest cart items after a mutation', async () => {
    const completed = firstValueFrom(effects.persistCart$);
    actions$.next(CartActions.addItem({ productId: 'product-1', quantity: 2 }));
    await completed;

    expect(JSON.parse(localStorage.getItem('shopping_cart_data')!)).toEqual({
      items,
      totalItems: 2,
    });
  });
});
