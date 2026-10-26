import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductCategoryService } from '../../../services/product-category.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductsFormViewComponent } from '../../presentational/products-form-view/products-form-view.component';
import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductRequest, Product } from '../../../features/shared/types/products.types';

@Component({
  imports: [ProductsFormViewComponent],
  selector: 'app-products-form',
  template: `<app-products-form-view
    [categories]="categories()"
    [initialData]="productToEdit()"
    (formSubmitted)="onFormSubmitted($event)"
    (cancelClicked)="onCancel()"
  ></app-products-form-view>`,
})
export class ProductsFormComponent implements OnInit {
  private readonly categoryService = inject(ProductCategoryService);
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  categories = toSignal(this.categoryService.getAllCategories(), { initialValue: [] });

  productToEdit = signal<Product | undefined>(undefined);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productsService
        .getProductById(productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((product) => {
          this.productToEdit.set(product);
        });
    }
  }

  onFormSubmitted(formData: CreateProductRequest): void {
    const currentProduct = this.productToEdit();

    if (currentProduct && currentProduct.id) {
      this.productsService
        .updateProduct(currentProduct.id, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.router.navigate(['/products']);
        });
    } else {
      this.productsService
        .createProduct(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.router.navigate(['/products']);
        });
    }
  }

  onCancel(): void {
    if (this.productToEdit()) {
      this.router.navigate(['/product', this.productToEdit()!.id]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
