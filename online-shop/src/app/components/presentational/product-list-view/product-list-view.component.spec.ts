import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '../../../features/shared/types/products.types';
import { ProductListViewComponent } from './product-list-view.component';

describe('ProductListViewComponent', () => {
  let component: ProductListViewComponent;
  let fixture: ComponentFixture<ProductListViewComponent>;
  const products: Product[] = [
    {
      id: 'product-1',
      name: 'Desk',
      description: 'A wooden desk',
      price: 250,
      weight: 20,
      category: 'Furniture',
      categoryDescription: 'Furniture products',
      imageUrl: 'desk.jpg',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', products);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('isAdmin', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the product list and exposes the displayed columns', () => {
    expect(component.products()).toEqual(products);
    expect(component.displayedColumns).toEqual(['image', 'name', 'price', 'actions']);
    expect(fixture.nativeElement.textContent).toContain('Desk');
    expect(fixture.nativeElement.textContent).toContain('250 RON');
  });

  it('emits the product id when details is clicked', () => {
    const clicked = vi.fn();
    component.productClicked.subscribe(clicked);

    const detailsButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    detailsButton.click();

    expect(clicked).toHaveBeenCalledWith('product-1');
  });

  it('shows the add button only for admins and emits when clicked', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Add Product');

    const added = vi.fn();
    component.addProductClicked.subscribe(added);
    fixture.componentRef.setInput('isAdmin', true);
    fixture.detectChanges();

    const addButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent.includes('Add Product')) as HTMLButtonElement;
    addButton.click();

    expect(added).toHaveBeenCalledOnce();
  });

  it('renders loading, error with retry, and empty-list states', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading products...');
    expect(fixture.nativeElement.textContent).not.toContain('Desk');

    const retried = vi.fn();
    component.retryClicked.subscribe(retried);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('error', 'Backend unavailable');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Unable to load products: Backend unavailable',
    );
    expect(fixture.nativeElement.textContent).not.toContain('Desk');
    const retryButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent.includes('Retry')) as HTMLButtonElement;
    retryButton.click();
    expect(retried).toHaveBeenCalledOnce();

    fixture.componentRef.setInput('error', null);
    fixture.componentRef.setInput('products', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No products available.');
  });
});
