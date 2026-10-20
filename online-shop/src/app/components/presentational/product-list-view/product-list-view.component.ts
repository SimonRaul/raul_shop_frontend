import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Product} from '../../../types/products.types';

@Component({
  imports: [],
  selector: 'app-product-list-view',
  styleUrl: './product-list-view.component.scss',
  templateUrl: './product-list-view.component.html',
})
export class ProductListViewComponent {
  @Input({required: true}) products!: Product[];
  @Output() productClicked = new EventEmitter<string>();

  onProductClick(productId: string): void {
    this.productClicked.emit(productId);
  }
}
