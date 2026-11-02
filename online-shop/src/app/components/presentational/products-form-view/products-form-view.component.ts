import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../features/shared/types/product-category.types';
import { CreateProductRequest, Product } from '../../../features/shared/types/products.types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
  private readonly formBuilder = inject(FormBuilder);
  categories = input.required<Category[]>();
  formSubmitted = output<CreateProductRequest>();
  initialData = input<Product | null>(null);
  cancelClicked = output<void>();
  isLoading = input<boolean>(false);

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [
      0,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(String.raw`^[0-9]+(\.[0-9]{1,2})?$`),
      ],
    ],
    weight: [
      0,
      [Validators.required, Validators.min(0), Validators.pattern(String.raw`^[0-9]+(\.[0-9]+)?$`)],
    ],
    categoryId: ['', Validators.required],
    imageUrl: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const product = this.initialData();
      const allCategories = this.categories();

      if (product) {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          weight: product.weight,
          imageUrl: product.imageUrl,
        });

        if (allCategories.length > 0) {
          const matchedCategory = allCategories.find((c) => c.name === product.category);
          if (matchedCategory) {
            this.productForm.patchValue({ categoryId: matchedCategory.id });
          }
        }
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const rawFormValue = this.productForm.getRawValue() as CreateProductRequest;

      this.formSubmitted.emit(rawFormValue);
    }
  }
}
