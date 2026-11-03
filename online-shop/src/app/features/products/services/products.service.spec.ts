import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CreateProductRequest, Product } from '../types/products.types';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests all products and a product by id', async () => {
    const product = { id: '1', name: 'Desk' } as Product;
    const products = firstValueFrom(service.getAllProducts());
    const listRequest = http.expectOne('http://localhost:8080/api/products');
    expect(listRequest.request.method).toBe('GET');
    listRequest.flush([product]);
    await expect(products).resolves.toEqual([product]);

    const details = firstValueFrom(service.getProductById('1'));
    const detailsRequest = http.expectOne('http://localhost:8080/api/products/1');
    expect(detailsRequest.request.method).toBe('GET');
    detailsRequest.flush(product);
    await expect(details).resolves.toEqual(product);
  });

  it('sends product create, update, and delete requests', () => {
    const request = {} as CreateProductRequest;
    service.createProduct(request).subscribe();
    expect(http.expectOne('http://localhost:8080/api/products').request).toMatchObject({
      method: 'POST',
      body: request,
    });

    service.updateProduct('1', request).subscribe();
    expect(http.expectOne('http://localhost:8080/api/products/1').request).toMatchObject({
      method: 'PUT',
      body: request,
    });

    service.deleteProduct('1').subscribe();
    expect(http.expectOne('http://localhost:8080/api/products/1').request.method).toBe('DELETE');
  });
});
