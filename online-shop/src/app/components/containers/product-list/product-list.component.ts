import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../features/shared/types/users.types';
import { Store } from '@ngrx/store';
import { ProductActions } from '../../../features/shared/state/app.actions';
import { selectProducts } from '../../../features/shared/state/app.reducers';

@Component({
  imports: [ProductListViewComponent],
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-product-list-view
    [products]="productList()"
    (productClicked)="goToDetails($event)"
    (addProductClicked)="onAddProduct()"
    [isAdmin]="isAdmin"
  >
  </app-product-list-view>`,
})
export class ProductListComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private store = inject(Store);
  productsState = this.store.selectSignal(selectProducts);
  productList = computed(() => this.productsState().list);
  isAdmin = this.authService.getRole() === UserRole.ADMIN;

  ngOnInit(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  goToDetails(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onAddProduct(): void {
    this.router.navigate(['/products', 'new']);
  }
}
