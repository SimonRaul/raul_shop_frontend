import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';
import { hasUserRole, UserRole } from '../../../../user/types/users.types';
import { Store } from '@ngrx/store';
import { ProductActions } from '../../../state/products.actions';
import {
  selectProductList,
  selectProductsError,
  selectProductsLoading,
} from '../../../state/products.reducers';
import { selectUser } from '../../../../auth/state/auth.reducers';

@Component({
  imports: [ProductListViewComponent],
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-product-list-view
    [products]="productList()"
    [isLoading]="isLoading()"
    [error]="error()"
    [isAdmin]="isAdmin()"
    (productClicked)="goToDetails($event)"
    (addProductClicked)="onAddProduct()"
    (retryClicked)="loadProducts()"
  >
  </app-product-list-view>`,
})
export class ProductListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly currentUser = this.store.selectSignal(selectUser);
  readonly productList = this.store.selectSignal(selectProductList);
  readonly isLoading = this.store.selectSignal(selectProductsLoading);
  readonly error = this.store.selectSignal(selectProductsError);
  readonly isAdmin = computed(() => hasUserRole(this.currentUser(), UserRole.ADMIN));

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  goToDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  onAddProduct(): void {
    this.router.navigate(['/products', 'new']);
  }
}
