import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../products/types/products.types';
import { Checkout } from '../../checkout/types/checkout.types';
import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let http: HttpTestingController;
  const product: Product = {
    id: 'product-1',
    name: 'Desk',
    description: 'A desk',
    price: 12.5,
    weight: 2,
    category: 'Furniture',
    categoryDescription: 'Furniture',
    imageUrl: 'desk.jpg',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ShoppingCartService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('starts empty and adds products, combining duplicate items', () => {
    expect(service).toBeTruthy();
    service.addToCart(product);
    service.addToCart(product, 2);

    expect(service.getCartState()()).toEqual({
      items: [{ productId: product.id, quantity: 3 }],
      totalItems: 3,
    });
    expect(JSON.parse(localStorage.getItem('shopping_cart_data')!)).toEqual(
      service.getCartState()(),
    );
  });

  it('updates quantities and removes invalid quantities', () => {
    service.addToCart(product, 2);
    service.updateItemQuantity(product.id, '4');
    expect(service.getCartState()().items[0].quantity).toBe(4);

    service.updateItemQuantity(product.id, '0');
    expect(service.getCartState()()).toEqual({ items: [], totalItems: 0 });
    expect(localStorage.getItem('shopping_cart_data')).toContain('"items":[]');
  });

  it('loads and normalizes saved cart data', () => {
    localStorage.setItem(
      'shopping_cart_data',
      JSON.stringify({
        items: [{ productId: product.id, quantity: '2' }],
        totalItems: '2',
      }),
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ShoppingCartService);
    http = TestBed.inject(HttpTestingController);

    expect(service.getCartState()().items[0].productId).toBe(product.id);
    expect(service.getCartState()().items[0].quantity).toBe(2);
    expect(service.getCartState()().totalItems).toBe(2);
  });

  it('clears malformed saved data and clears the cart', () => {
    localStorage.setItem('shopping_cart_data', '{invalid');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service = TestBed.inject(ShoppingCartService);
    http = TestBed.inject(HttpTestingController);

    expect(service.getCartState()()).toEqual({ items: [], totalItems: 0 });
    expect(localStorage.getItem('shopping_cart_data')).toBeNull();
    expect(consoleError).toHaveBeenCalled();

    service.addToCart(product);
    service.clearCart();
    expect(service.getCartState()()).toEqual({ items: [], totalItems: 0 });
    consoleError.mockRestore();
  });

  it('creates an order through the API', async () => {
    const order = {} as Checkout;
    const result = firstValueFrom(service.createOrder(order));
    const request = http.expectOne('http://localhost:8080/api/orders');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(order);
    request.flush({ id: 'order-1' });

    await expect(result).resolves.toEqual({ id: 'order-1' });
  });
});
