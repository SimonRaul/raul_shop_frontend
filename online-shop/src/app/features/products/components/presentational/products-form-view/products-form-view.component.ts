import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../types/product-category.types';
import { CreateProductRequest, Product } from '../../../types/products.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductForm } from '../../../types/product-form.types';

@Component({
  imports: [
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  selector: 'app-products-form-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-form-view.component.scss',
  templateUrl: './products-form-view.component.html',
})
export class ProductsFormViewComponent {
  readonly categories = input.required<Category[]>();
  formSubmitted = output<CreateProductRequest>();
  readonly initialData = input<Product | null>(null);
  cancelClicked = output<void>();
  readonly isLoading = input<boolean>(false);
  readonly productForm = input.required<ProductForm>();

  constructor() {
    effect(() => {
      const product = this.initialData();
      const form = this.productForm();

      if (product) {
        const allCategories = this.categories();

        form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          weight: product.weight,
          imageUrl: product.imageUrl,
        });

        if (allCategories.length > 0) {
          const matchedCategory = allCategories.find((c) => c.name === product.category);
          if (matchedCategory) {
            form.patchValue({ categoryId: matchedCategory.id });
          }
        }
      } else {
        form.reset();
      }
    });
  }

  onSubmit(): void {
    const form = this.productForm();

    if (form.valid) {
      const rawFormValue = form.getRawValue() as CreateProductRequest;
      this.formSubmitted.emit(rawFormValue);
    }
  }
}
