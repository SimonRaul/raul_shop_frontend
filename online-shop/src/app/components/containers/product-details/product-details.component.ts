import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';
import { mockProducts } from '../../../mocks/products.mocks';
import { ProductDetailsViewComponent } from '../../presentational/product-details-view/product-details-view.component';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [ProductDetailsViewComponent],
  selector: 'app-product-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` @if (product(); as p) {
      <app-product-details-view
        [productData]="p"
        (addToCartClicked)="onAddToCartClicked($event)"
      ></app-product-details-view>
    } @else {
      <p>Loading Product Details...</p>
    }`,
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.loadProductDetails(idParam);
    }
  }

  loadProductDetails(productId: string): void {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      this.product.set(product);
    }
  }

  onAddToCartClicked(productId: string): void {}
}
