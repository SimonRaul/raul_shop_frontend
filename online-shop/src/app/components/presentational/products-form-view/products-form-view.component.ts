import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../features/shared/types/product-category.types';
import { CreateProductRequest, Product } from '../../../features/shared/types/products.types';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-products-form-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-form-view.component.scss',
  templateUrl: './products-form-view.component.html',
})
export class ProductsFormViewComponent {
  private formBuilder = inject(FormBuilder);
  categories = input.required<Category[]>();
  formSubmitted = output<CreateProductRequest>();
  initialData = input<Product | undefined>(undefined);
  cancelClicked = output<void>();

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    weight: [0, [Validators.required, Validators.min(0)]],
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
