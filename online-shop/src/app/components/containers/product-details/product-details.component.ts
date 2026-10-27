import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ProductDetailsViewComponent } from '../../presentational/product-details-view/product-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../features/shared/types/users.types';
import { Store } from '@ngrx/store';
import { ProductActions, ShoppingCartActions } from '../../../features/shared/state/app.actions';
import { selectProducts } from '../../../features/shared/state/app.reducers';

@Component({
  imports: [ProductDetailsViewComponent],
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` @if (product(); as p) {
      <app-product-details-view
        [productData]="p"
        [isAdmin]="isAdmin"
        (addToCartClicked)="onAddToCartClicked()"
        (deleteProductClicked)="onDelete($event)"
        (updateProductClicked)="onUpdate($event)"
      ></app-product-details-view>
    } @else {
      <p>Loading Product Details...</p>
    }`,
})
export class ProductDetailsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  productsState = this.store.selectSignal(selectProducts);
  product = computed(() => this.productsState().selectedProduct);
  isAdmin = this.authService.getRole() === UserRole.ADMIN;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.store.dispatch(ProductActions.loadSingleProduct({ productId: idParam }));
    }
  }

  onAddToCartClicked(): void {
    const currentProduct = this.product();

    if (currentProduct) {
      this.store.dispatch(
        ShoppingCartActions.addToCart({ productId: currentProduct.id, quantity: 1 }),
      );
    }
  }

  onDelete(productId: string): void {
    this.store.dispatch(ProductActions.deleteProduct({ productId }));
    this.router.navigate(['/products']);
  }

  onUpdate(productId: string): void {
    this.router.navigate(['/products', productId, 'edit']);
  }
}
