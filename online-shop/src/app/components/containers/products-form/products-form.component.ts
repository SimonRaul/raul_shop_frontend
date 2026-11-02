import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductsFormViewComponent } from '../../presentational/products-form-view/products-form-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProductRequest } from '../../../features/shared/types/products.types';
import { Store } from '@ngrx/store';
import {
  selectCategories,
  selectProducts,
} from '../../../features/products/state/products.reducers';
import { CategoryActions, ProductActions } from '../../../features/products/state/products.actions';

@Component({
  imports: [ProductsFormViewComponent],
  selector: 'app-products-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-products-form-view
    [categories]="categoriesList()"
    [initialData]="productToEdit()"
    (formSubmitted)="onFormSubmitted($event)"
    (cancelClicked)="onCancel()"
  ></app-products-form-view>`,
})
export class ProductsFormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriesState = this.store.selectSignal(selectCategories);
  private readonly productsState = this.store.selectSignal(selectProducts);
  categoriesList = computed(() => this.categoriesState().list);
  productToEdit = computed(() => this.productsState().selectedProduct);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadCategories());
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.store.dispatch(ProductActions.loadSingleProduct({ productId: productId }));
    } else {
      this.store.dispatch(ProductActions.clearSelectedProduct());
    }
  }

  onFormSubmitted(formData: CreateProductRequest): void {
    this.isLoading.set(true);
    const currentProduct = this.productToEdit();

    if (currentProduct?.id) {
      this.store.dispatch(
        ProductActions.updateProduct({ productId: currentProduct.id, productData: formData }),
      );
    } else {
      this.store.dispatch(ProductActions.addProduct({ product: formData }));
    }
    this.isLoading.set(false);
  }

  onCancel(): void {
    const current = this.productToEdit();
    if (current) {
      this.router.navigate(['/product', current.id]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
