import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [ProductListViewComponent],
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-product-list-view
    [products]="products()"
    (productClicked)="goToDetails($event)"
    (addProductClicked)="onAddProduct()"
  >
  </app-product-list-view>`,
})
export class ProductListComponent {
  private router: Router = inject(Router);
  private readonly productsService: ProductsService = inject(ProductsService);
  products = toSignal(this.productsService.getAllProducts(), { initialValue: [] });

  goToDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onAddProduct(): void {
    this.router.navigate(['/products', 'new']);
  }
}
