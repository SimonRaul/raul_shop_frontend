import { Component, OnInit } from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';
import { mockProducts } from '../../../mocks/products.mocks';
import { ProductDetailsViewComponent } from '../../presentational/product-details-view/product-details-view.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [ProductDetailsViewComponent],
  selector: 'app-product-details',
  template: ` @if (product) {
      <app-product-details-view [productData]="product"></app-product-details-view>
    } @else {
      <p>Loading Product Details...</p>
    }`,
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (idParam) {
        this.loadProductDetails(idParam);
      }
    });
  }

  loadProductDetails(productId: string): void {
    this.product = mockProducts.find((p) => p.id === productId);
  }
}
