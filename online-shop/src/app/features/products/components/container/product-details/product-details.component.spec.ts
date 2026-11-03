import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductDetailsComponent } from './product-details.component';
import { ProductActions } from '../../../state/products.actions';
import { selectProducts } from '../../../state/products.reducers';
import { Product } from '../../../types/products.types';
import { ShoppingCartService } from '../../../../shopping-cart/services/shopping-cart.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let dispatch: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  let addToCart: ReturnType<typeof vi.fn>;
  let routeId: string | null;
  const productsState = signal<{
    selectedProduct: Product | null;
    isLoading: boolean;
    error: string | null;
  }>({
    selectedProduct: null,
    isLoading: false,
    error: null,
  });
  const authState = signal<{ user: { role: string } | null }>({ user: null });
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
    routeId = null;
    dispatch = vi.fn();
    navigate = vi.fn();
    addToCart = vi.fn();
    productsState.set({ selectedProduct: null, isLoading: false, error: null });
    authState.set({ user: null });

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: (selector: unknown) =>
              selector === selectProducts ? productsState : authState,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => routeId } } },
        },
        { provide: Router, useValue: { navigate } },
        { provide: ShoppingCartService, useValue: { addToCart } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
  });

  it('loads the product when a route id is present', () => {
    routeId = product.id;
    fixture.detectChanges();

    expect(dispatch).toHaveBeenCalledWith(
      ProductActions.loadSingleProduct({ productId: product.id }),
    );
  });

  it('does not load a product without a route id', () => {
    fixture.detectChanges();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('exposes the selected product and admin state', () => {
    productsState.set({ selectedProduct: product, isLoading: false, error: null });
    expect(component.product()).toEqual(product);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.isAdmin()).toBe(false);
  });

  it('renders loading, error, and empty states separately', () => {
    productsState.set({ selectedProduct: null, isLoading: true, error: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading product details...');

    productsState.set({
      selectedProduct: null,
      isLoading: false,
      error: 'Product request failed',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Unable to load product details: Product request failed',
    );

    productsState.set({ selectedProduct: null, isLoading: false, error: null });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Product not found.');
  });

  it('renders product details after loading succeeds', () => {
    productsState.set({ selectedProduct: product, isLoading: false, error: null });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(product.name);
    expect(fixture.nativeElement.textContent).not.toContain('Product not found.');
  });

  it('adds the selected product to the cart and ignores an empty selection', () => {
    component.onAddToCartClicked();
    expect(addToCart).not.toHaveBeenCalled();

    productsState.set({ selectedProduct: product, isLoading: false, error: null });
    component.onAddToCartClicked();
    expect(addToCart).toHaveBeenCalledWith(product);
  });

  it('dispatches deletion and navigates to the edit form', () => {
    component.onDelete(product.id);
    expect(dispatch).toHaveBeenCalledWith(ProductActions.deleteProduct({ productId: product.id }));

    component.onUpdate(product.id);
    expect(navigate).toHaveBeenCalledWith(['/products', product.id, 'edit']);
  });
});
