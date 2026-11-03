import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Product } from '../../../types/products.types';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/presentational/confirmation-dialog/confirmation-dialog.component';

@Component({
  imports: [MatCardModule, MatButtonModule],
  selector: 'app-product-details-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './product-details-view.component.scss',
  templateUrl: './product-details-view.component.html',
})
export class ProductDetailsViewComponent {
  readonly productData = input.required<Product>();
  readonly addToCartClicked = output<Product>();
  readonly deleteProductClicked = output<string>();
  readonly updateProductClicked = output<string>();
  readonly isAdmin = input.required<boolean>();
  private readonly dialog = inject(MatDialog);

  showDeleteConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteProductClicked.emit(this.productData().id);
      }
    });
  }
}
