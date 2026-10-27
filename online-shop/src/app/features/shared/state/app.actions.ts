import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserLoginRequest } from '../types/users.types';
import { CreateProductRequest, Product } from '../types/products.types';
import { Checkout } from '../types/checkout.types';
import { Category } from '../types/product-category.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ request: UserLoginRequest }>(),
    Logout: emptyProps(),
    'Validate Session': emptyProps(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Session Valid': props<{ user: User }>(),
    'Session Invalid': emptyProps(),
  },
});

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
    'Delete Product Success': emptyProps(),
    'Delete Product Failure': props<{ error: string }>(),
    'Load Single Product Success': props<{ product: Product }>(),
    'Load Single Product Failure': props<{ error: string }>(),
  },
});

export const ShoppingCartActions = createActionGroup({
  source: 'Shopping Cart',
  events: {
    'Add to Cart': props<{ productId: string; quantity: number }>(),
    'Update Quantity': props<{ productId: string; newQuantity: number }>(),
    'Clear Cart': emptyProps(),
    'Remove from Cart': props<{ productId: string }>(),
    Checkout: props<{ checkoutData: Checkout }>(),
    'Checkout Success': emptyProps(),
    'Checkout Failure': props<{ error: string }>(),
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
