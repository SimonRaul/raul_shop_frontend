import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';

@Component({
  imports: [],
  selector: 'app-product-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-details-view.component.scss',
  templateUrl: './product-details-view.component.html',
})
export class ProductDetailsViewComponent {
  productData = input.required<Product>();
}
