import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';
import { ProductDetailsViewComponent } from '../../presentational/product-details-view/product-details-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../../services/products.service';
import { ShoppingCartService } from '../../../features/shared/shopping-cart/services/shopping-cart.service';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../features/shared/types/users.types';

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
  product = signal<Product | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly shoppingCartService = inject(ShoppingCartService);
  private readonly authService = inject(AuthService);
  private router: Router = inject(Router);

  isAdmin = this.authService.getRole() === UserRole.ADMIN;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.loadProductDetails(idParam);
    }
  }

  loadProductDetails(productId: string): void {
    this.productsService
      .getProductById(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.product.set(data);
      });
  }

  onAddToCartClicked(): void {
    const currentProduct = this.product();

    if (currentProduct) {
      this.shoppingCartService.addToCart(currentProduct);
    }
  }

  onDelete(productId: string): void {
    this.productsService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }

  onUpdate(productId: string): void {
    this.router.navigate(['/products', productId, 'edit']);
  }
}
