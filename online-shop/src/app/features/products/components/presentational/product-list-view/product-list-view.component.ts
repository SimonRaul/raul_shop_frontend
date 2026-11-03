import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Product } from '../../../types/products.types';
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
  readonly products = input.required<Product[]>();
  readonly isLoading = input.required<boolean>();
  readonly error = input.required<string | null>();
  readonly isAdmin = input.required<boolean>();
  readonly productClicked = output<string>();
  readonly addProductClicked = output<void>();
  readonly retryClicked = output<void>();
  readonly displayedColumns: string[] = ['image', 'name', 'price', 'actions'];
}
