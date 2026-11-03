import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Category } from '../types/product-category.types';
import { ProductCategoryService } from './product-category.service';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductCategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads all product categories', async () => {
    const categories = [{ id: '1', name: 'Furniture' }] as Category[];
    const result = firstValueFrom(service.getAllCategories());
    const request = http.expectOne('http://localhost:8080/api/product-categories');

    expect(request.request.method).toBe('GET');
    request.flush(categories);

    await expect(result).resolves.toEqual(categories);
  });
});
