import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ProductDetailsViewComponent } from '../../presentational/product-details-view/product-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { hasUserRole, UserRole } from '../../../features/shared/types/users.types';
import { Store } from '@ngrx/store';
import { ProductActions } from '../../../features/products/state/products.actions';
import { selectProducts } from '../../../features/products/state/products.reducers';
import { selectAuthState } from '../../../core/state/auth/auth.reducers';
import { ShoppingCartService } from '../../../features/shared/shopping-cart/services/shopping-cart.service';

@Component({
  imports: [ProductDetailsViewComponent],
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` @if (isLoading()) {
      <p role="status">Loading product details...</p>
    } @else if (error(); as errorMessage) {
      <p role="alert">Unable to load product details: {{ errorMessage }}</p>
    } @else if (product(); as p) {
      <app-product-details-view
        [productData]="p"
        [isAdmin]="isAdmin()"
        (addToCartClicked)="onAddToCartClicked()"
        (deleteProductClicked)="onDelete($event)"
        (updateProductClicked)="onUpdate($event)"
      ></app-product-details-view>
    } @else {
      <p>Product not found.</p>
    }`,
})
export class ProductDetailsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(ShoppingCartService);
  private readonly router = inject(Router);
  private readonly productsState = this.store.selectSignal(selectProducts);
  private readonly authState = this.store.selectSignal(selectAuthState);
  readonly product = computed(() => this.productsState().selectedProduct);
  readonly isLoading = computed(() => this.productsState().isLoading);
  readonly error = computed(() => this.productsState().error);
  readonly isAdmin = computed(() => hasUserRole(this.authState().user, UserRole.ADMIN));

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.store.dispatch(ProductActions.loadSingleProduct({ productId: idParam }));
    }
  }

  onAddToCartClicked(): void {
    const currentProduct = this.product();

    if (currentProduct) {
      this.cartService.addToCart(currentProduct);
    }
  }

  onDelete(productId: string): void {
    this.store.dispatch(ProductActions.deleteProduct({ productId }));
  }

  onUpdate(productId: string): void {
    this.router.navigate(['/products', productId, 'edit']);
  }
}
