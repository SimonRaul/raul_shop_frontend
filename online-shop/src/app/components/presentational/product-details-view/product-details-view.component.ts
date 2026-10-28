import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatCardModule, MatButtonModule],
  selector: 'app-product-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-details-view.component.scss',
  templateUrl: './product-details-view.component.html',
})
export class ProductDetailsViewComponent {
  productData = input.required<Product>();
  addToCartClicked = output<Product>();
  deleteProductClicked = output<string>();
  updateProductClicked = output<string>();
  isAdmin = input.required<boolean>();
}
