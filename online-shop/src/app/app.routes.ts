import { Routes } from '@angular/router';
import { ProductListComponent } from './components/containers/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/containers/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'shopping-cart',
    loadComponent: () =>
      import('./features/shared/shopping-cart/components/containers/shopping-cart-details/shopping-cart-details.component').then(
        (m) => m.ShoppingCartDetailsComponent,
      ),
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./components/containers/products-form/products-form.component').then(
        (m) => m.ProductsFormComponent,
      ),
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./components/containers/products-form/products-form.component').then(
        (m) => m.ProductsFormComponent,
      ),
  },
];
