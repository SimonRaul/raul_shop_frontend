import { inject, Service, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../features/shared/types/products.types';

@Service()
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.apiUrl + '/products';

  getAllProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}`);
  }

  getProductById(productId: string) {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }
}
