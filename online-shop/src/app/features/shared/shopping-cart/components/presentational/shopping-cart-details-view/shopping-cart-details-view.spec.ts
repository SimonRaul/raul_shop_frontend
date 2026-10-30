import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartDetailsView } from './shopping-cart-details-view';
import { Product } from '../../../../types/products.types';

describe('ShoppingCartDetailsView', () => {
  let component: ShoppingCartDetailsView;
  let fixture: ComponentFixture<ShoppingCartDetailsView>;
  const product: Product = {
    id: 'product-1',
    name: 'Desk',
    description: 'A desk',
    price: 25,
    weight: 2,
    category: 'Furniture',
    categoryDescription: 'Furniture',
    imageUrl: 'desk.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartDetailsView],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartDetailsView);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalPrice', 50);
    fixture.componentRef.setInput('totalItems', 2);
    fixture.componentRef.setInput('items', [{ product, quantity: 2 }]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders cart items and the order summary', () => {
    expect(fixture.nativeElement.textContent).toContain('Desk');
    expect(fixture.nativeElement.textContent).toContain('Total Items:');
    expect(fixture.nativeElement.textContent).toContain('50 RON');
  });

  it('emits quantity, remove, and checkout events', () => {
    const quantityChanged = vi.fn();
    const itemRemoved = vi.fn();
    const checkout = vi.fn();
    component.quantityChanged.subscribe(quantityChanged);
    component.itemRemoved.subscribe(itemRemoved);
    component.checkoutClicked.subscribe(checkout);

    const input = fixture.nativeElement.querySelector('.qty-input') as HTMLInputElement;
    input.value = '3';
    input.dispatchEvent(new Event('change'));
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.full-width-btn') as HTMLButtonElement).click();

    expect(quantityChanged).toHaveBeenCalledWith({ productId: 'product-1', rawValue: '3' });
    expect(itemRemoved).toHaveBeenCalledWith('product-1');
    expect(checkout).toHaveBeenCalled();
  });

  it('renders the empty state', () => {
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your shopping cart is empty.');
  });
});
