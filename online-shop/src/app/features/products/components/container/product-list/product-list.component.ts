import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ProductListViewComponent } from '../../presentational/product-list-view/product-list-view.component';
import { Router } from '@angular/router';
import { hasUserRole, UserRole } from '../../../../user/types/users.types';
import { Store } from '@ngrx/store';
import { ProductActions } from '../../../state/products.actions';
import { selectProducts } from '../../../state/products.reducers';
import { selectAuthState } from '../../../../auth/state/auth.reducers';

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
  private readonly productsState = this.store.selectSignal(selectProducts);
  private readonly authState = this.store.selectSignal(selectAuthState);
  readonly productList = computed(() => this.productsState().list);
  readonly isLoading = computed(() => this.productsState().isLoading);
  readonly error = computed(() => this.productsState().error);
  readonly isAdmin = computed(() => hasUserRole(this.authState().user, UserRole.ADMIN));

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
