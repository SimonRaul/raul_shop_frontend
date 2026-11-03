import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Product } from '../../../types/products.types';
import { ProductDetailsViewComponent } from './product-details-view.component';

describe('ProductDetailsViewComponent', () => {
  let component: ProductDetailsViewComponent;
  let fixture: ComponentFixture<ProductDetailsViewComponent>;
  const product: Product = {
    id: 'product-1',
    name: 'Desk',
    description: 'A wooden desk',
    price: 250,
    weight: 20,
    category: 'Furniture',
    categoryDescription: 'Furniture products',
    imageUrl: 'desk.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsViewComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('productData', product);
    fixture.componentRef.setInput('isAdmin', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the product details and customer actions', () => {
    expect(component.productData()).toEqual(product);
    expect(fixture.nativeElement.textContent).toContain('Desk');
    expect(fixture.nativeElement.textContent).toContain('Price: 250 RON');
    expect(fixture.nativeElement.textContent).toContain('Category: Furniture');
    expect(fixture.nativeElement.textContent).toContain('A wooden desk');
    expect(fixture.nativeElement.textContent).toContain('Weight: 20 kg');
    expect(fixture.nativeElement.textContent).toContain('Add to Cart');
    expect(fixture.nativeElement.textContent).not.toContain('Edit');
    expect(fixture.nativeElement.textContent).not.toContain('Delete');
  });

  it('emits the product when add to cart is clicked', () => {
    const added = vi.fn();
    component.addToCartClicked.subscribe(added);

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((item) => item.textContent.includes('Add to Cart')) as HTMLButtonElement;
    button.click();

    expect(added).toHaveBeenCalledWith(product);
  });

  it('shows admin actions and emits the product id', () => {
    const updated = vi.fn();
    const deleted = vi.fn();
    component.updateProductClicked.subscribe(updated);
    component.deleteProductClicked.subscribe(deleted);
    fixture.componentRef.setInput('isAdmin', true);
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    );
    buttons.find((button) => button.textContent.includes('Edit'))?.click();
    buttons.find((button) => button.textContent.includes('Delete'))?.click();

    expect(updated).toHaveBeenCalledWith(product.id);
    expect(deleted).toHaveBeenCalledWith(product.id);
  });
});
