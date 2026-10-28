import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../../features/shared/types/products.types';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [MatButtonModule, MatTableModule],
  selector: 'app-product-list-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-list-view.component.scss',
  templateUrl: './product-list-view.component.html',
})
export class ProductListViewComponent {
  products = input.required<Product[]>();
  productClicked = output<string>();
  addProductClicked = output<void>();
  isAdmin = input.required<boolean>();
  displayedColumns: string[] = ['image', 'name', 'price', 'actions'];
}
