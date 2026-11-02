import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductsFormComponent } from './products-form.component';
import { CategoryActions, ProductActions } from '../../../features/products/state/products.actions';
import { selectCategories } from '../../../features/products/state/products.reducers';
import { CreateProductRequest, Product } from '../../../features/shared/types/products.types';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;
  let dispatch: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;
  let routeId: string | null;
  const categoriesState = signal({
    list: [{ id: 'cat-1', name: 'Books' }],
    isLoading: false,
    error: null,
  });
  const productsState = signal<{ list: Product[]; selectedProduct: Product | null }>({
    list: [],
    selectedProduct: null,
  });

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
  const formData: CreateProductRequest = {
    name: 'New book',
    description: 'A new book',
    price: 15,
    weight: 1,
    categoryId: 'cat-1',
    imageUrl: 'new-book.jpg',
  };

  beforeEach(async () => {
    routeId = null;
    dispatch = vi.fn();
    navigate = vi.fn();
    categoriesState.set({ list: [{ id: 'cat-1', name: 'Books' }], isLoading: false, error: null });
    productsState.set({ list: [], selectedProduct: null });

    await TestBed.configureTestingModule({
      imports: [ProductsFormComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch,
            selectSignal: (selector: unknown) =>
              selector === selectCategories ? categoriesState : productsState,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => routeId } } },
        },
        { provide: Router, useValue: { navigate } },
      ],
    })
      .overrideComponent(ProductsFormComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
  });

  it('should expose categories and the selected product from store state', () => {
    productsState.set({ list: [], selectedProduct: product });

    expect(component.categoriesList()).toEqual(categoriesState().list);
    expect(component.productToEdit()).toEqual(product);
  });

  it('loads categories and clears the selected product when creating a product', () => {
    fixture.detectChanges();

    expect(dispatch).toHaveBeenNthCalledWith(1, CategoryActions.loadCategories());
    expect(dispatch).toHaveBeenNthCalledWith(2, ProductActions.clearSelectedProduct());
  });

  it('loads the product when editing an existing product', () => {
    routeId = 'product-1';
    fixture.detectChanges();

    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      ProductActions.loadSingleProduct({ productId: 'product-1' }),
    );
  });

  it('dispatches add and update actions and resets loading state', () => {
    component.onFormSubmitted(formData);
    expect(dispatch).toHaveBeenCalledWith(ProductActions.addProduct({ product: formData }));
    expect(component.isLoading()).toBe(false);

    productsState.set({ list: [], selectedProduct: product });
    component.onFormSubmitted(formData);
    expect(dispatch).toHaveBeenCalledWith(
      ProductActions.updateProduct({ productId: product.id, productData: formData }),
    );
    expect(component.isLoading()).toBe(false);
  });

  it('navigates to the selected product or product list when cancelled', () => {
    component.onCancel();
    expect(navigate).toHaveBeenCalledWith(['/products']);

    productsState.set({ list: [], selectedProduct: product });
    component.onCancel();
    expect(navigate).toHaveBeenCalledWith(['/product', product.id]);
  });
});
