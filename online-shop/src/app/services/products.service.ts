import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateProductRequest, Product } from '../features/shared/types/products.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl: string = environment.apiUrl + '/products';

  getAllProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProductById(productId: string) {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  deleteProduct(productId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  updateProduct(productId: string, productData: CreateProductRequest) {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  createProduct(productData: CreateProductRequest) {
    return this.http.post<Product>(`${this.apiUrl}`, productData);
  }
}
