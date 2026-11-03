import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductListComponent } from './product-list.component';
import { ProductActions } from '../../../state/products.actions';
import {
  selectProductList,
  selectProductsError,
  selectProductsLoading,
} from '../../../state/products.reducers';
import { Product } from '../../../types/products.types';
import { UserRole } from '../../../../user/types/users.types';
import { selectUser } from '../../../../auth/state/auth.reducers';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let dispatch: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  const productsState = signal<{
    list: Product[];
    isLoading: boolean;
    error: string | null;
  }>({ list: [], isLoading: false, error: null });
  const authState = signal<{ role: string } | null>(null);
  const product: Product = {
    id: 'product-1',
    name: 'Book',
    description: 'A book',
    price: 12,
    weight: 1,
    category: 'Books',
    categoryDescription: 'Books',
    imageUrl: 'book.jpg',
  };

  beforeEach(async () => {
    dispatch = vi.fn();
    navigate = vi.fn();
    productsState.set({ list: [], isLoading: false, error: null });
    authState.set(null);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: (selector: unknown) => {
              if (selector === selectProductList) {
                return computed(() => productsState().list);
              }
              if (selector === selectProductsLoading) {
                return computed(() => productsState().isLoading);
              }
              if (selector === selectProductsError) {
                return computed(() => productsState().error);
              }
              if (selector === selectUser) {
                return authState;
              }
              return computed(() => null);
            },
          },
        },
        { provide: Router, useValue: { navigate } },
      ],
    })
      .overrideComponent(ProductListComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('loads products on initialization', () => {
    fixture.detectChanges();

    expect(dispatch).toHaveBeenCalledWith(ProductActions.loadProducts());
  });

  it('exposes products and determines whether the current user is an admin', () => {
    productsState.set({ list: [product], isLoading: false, error: null });
    expect(component.productList()).toEqual([product]);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.isAdmin()).toBe(false);

    authState.set({ role: `ROLE_${UserRole.ADMIN}` });
    expect(component.isAdmin()).toBe(true);
  });

  it('exposes request state and retries loading products', () => {
    productsState.set({ list: [], isLoading: true, error: null });
    expect(component.isLoading()).toBe(true);

    productsState.set({ list: [], isLoading: false, error: 'Load failed' });
    expect(component.error()).toBe('Load failed');

    component.loadProducts();
    expect(dispatch).toHaveBeenCalledWith(ProductActions.loadProducts());
  });

  it('navigates to product details and the new-product form', () => {
    component.goToDetails(product.id);
    expect(navigate).toHaveBeenCalledWith(['/products', product.id]);

    component.onAddProduct();
    expect(navigate).toHaveBeenCalledWith(['/products', 'new']);
  });
});
