import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { mockProducts } from '../../../mocks/products.mocks';
import { Product } from '../../../features/shared/types/products.types';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';

@Component({
  imports: [ProductListViewComponent],
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-product-list-view [products]="products()" (productClicked)="goToDetails($event)">
  </app-product-list-view>`,
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products.set(mockProducts);
  }

  goToDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }
}
