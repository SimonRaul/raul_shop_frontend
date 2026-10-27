import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../features/shared/types/users.types';

@Component({
  imports: [ProductListViewComponent],
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-product-list-view
    [products]="products()"
    (productClicked)="goToDetails($event)"
    (addProductClicked)="onAddProduct()"
    [isAdmin]="isAdmin"
  >
  </app-product-list-view>`,
})
export class ProductListComponent {
  private router: Router = inject(Router);
  private readonly productsService: ProductsService = inject(ProductsService);
  private readonly authService: AuthService = inject(AuthService);
  products = toSignal(this.productsService.getAllProducts(), { initialValue: [] });
  isAdmin = this.authService.getRole() === UserRole.ADMIN;

  goToDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onAddProduct(): void {
    this.router.navigate(['/products', 'new']);
  }
}
