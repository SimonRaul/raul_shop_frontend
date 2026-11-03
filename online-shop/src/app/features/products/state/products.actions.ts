import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateProductRequest, Product } from '../types/products.types';
import { Category } from '../types/product-category.types';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': emptyProps(),
    'Load Single Product': props<{ productId: string }>(),
    'Add Product': props<{ product: CreateProductRequest }>(),
    'Update Product': props<{ productId: string; productData: CreateProductRequest }>(),
    'Delete Product': props<{ productId: string }>(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Add Product Success': props<{ product: Product }>(),
    'Add Product Failure': props<{ error: string }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Failure': props<{ error: string }>(),
    'Delete Product Success': props<{ productId: string }>(),
    'Delete Product Failure': props<{ error: string }>(),
    'Load Single Product Success': props<{ product: Product }>(),
    'Load Single Product Failure': props<{ error: string }>(),
    'Clear Selected Product': emptyProps(),
  },
});

export const CategoryActions = createActionGroup({
  source: 'Categories',
  events: {
    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),
  },
});
