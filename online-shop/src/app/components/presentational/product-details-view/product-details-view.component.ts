import {Component, Input} from '@angular/core';
import {Product} from '../../../types/products.types';

@Component({
  imports: [],
  selector: 'app-product-details-view',
  styleUrl: './product-details-view.component.scss',
  templateUrl: './product-details-view.component.html',
})
export class ProductDetailsViewComponent {
  @Input({required: true}) productData!: Product;

}
