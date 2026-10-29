import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Category } from '../../../features/shared/types/product-category.types';
import { Product } from '../../../features/shared/types/products.types';
import { ProductsFormViewComponent } from './products-form-view.component';

describe('ProductsFormViewComponent', () => {
  let component: ProductsFormViewComponent;
  let fixture: ComponentFixture<ProductsFormViewComponent>;
  const categories: Category[] = [
    { id: 'category-1', name: 'Furniture', description: 'Furniture products' },
    { id: 'category-2', name: 'Electronics', description: 'Electronic products' },
  ];
  const product: Product = {
    id: 'product-1',
    name: 'Desk',
    description: 'A wooden desk',
    price: 250,
    weight: 20,
    category: 'Furniture',
    categoryDescription: 'Furniture products',
    imageUrl: 'https://example.com/desk.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFormViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFormViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', categories);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an invalid form and does not emit invalid submissions', () => {
    const submitted = vi.fn();
    component.formSubmitted.subscribe(submitted);

    expect(component.productForm.invalid).toBe(true);

    component.onSubmit();

    expect(submitted).not.toHaveBeenCalled();
  });

  it('emits the form value when submitting a valid form', () => {
    const submitted = vi.fn();
    component.formSubmitted.subscribe(submitted);
    const formValue = {
      name: 'Desk',
      description: 'A wooden desk',
      price: 250,
      weight: 20,
      categoryId: 'category-1',
      imageUrl: 'https://example.com/desk.jpg',
    };

    component.productForm.setValue(formValue);
    component.onSubmit();

    expect(submitted).toHaveBeenCalledOnce();
    expect(submitted).toHaveBeenCalledWith(formValue);
  });

  it('patches edit data and matches the product category', async () => {
    fixture.componentRef.setInput('initialData', product);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.productForm.getRawValue()).toEqual({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      categoryId: 'category-1',
      imageUrl: product.imageUrl,
    });
  });

  it('does not set a category when the edit category has no match', async () => {
    fixture.componentRef.setInput('initialData', { ...product, category: 'Unknown' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.productForm.get('categoryId')?.value).toBe('');
  });

  it('emits when cancel is clicked', () => {
    const cancelled = vi.fn();
    component.cancelClicked.subscribe(cancelled);

    const cancelButton = fixture.nativeElement.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement;
    cancelButton.click();

    expect(cancelled).toHaveBeenCalledOnce();
  });

  it('disables submission and shows a spinner while loading', async () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
    expect(submitButton.querySelector('mat-progress-spinner')).toBeTruthy();
    expect(submitButton.textContent).not.toContain('Save Product');
  });
});
