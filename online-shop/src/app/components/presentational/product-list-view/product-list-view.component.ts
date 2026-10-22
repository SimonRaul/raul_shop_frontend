import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
  signal,
} from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';

@Component({
  imports: [],
  selector: 'app-product-list-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-list-view.component.scss',
  templateUrl: './product-list-view.component.html',
})
export class ProductListViewComponent {
  products = input.required<Product[]>();
  productClicked = output<string>();
}
