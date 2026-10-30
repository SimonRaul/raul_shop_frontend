import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductDetailsComponent } from './product-details.component';
import { ProductActions } from '../../../features/shared/state/app.actions';
import { selectAuth, selectProducts } from '../../../features/shared/state/app.reducers';
import { Product } from '../../../features/shared/types/products.types';
import { ShoppingCartService } from '../../../features/shared/shopping-cart/services/shopping-cart.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let dispatch: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  let addToCart: ReturnType<typeof vi.fn>;
  let routeId: string | null;
  const productsState = signal<{ selectedProduct: Product | null }>({ selectedProduct: null });
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
    productsState.set({ selectedProduct: null });
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
    })
      .overrideComponent(ProductDetailsComponent, { set: { template: '' } })
      .compileComponents();

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
    productsState.set({ selectedProduct: product });
    expect(component.product()).toEqual(product);
    expect(component.isAdmin()).toBe(false);
  });

  it('adds the selected product to the cart and ignores an empty selection', () => {
    component.onAddToCartClicked();
    expect(addToCart).not.toHaveBeenCalled();

    productsState.set({ selectedProduct: product });
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
