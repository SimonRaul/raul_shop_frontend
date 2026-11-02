import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../features/shared/types/product-category.types';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/product-categories';

  getAllCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }
}
