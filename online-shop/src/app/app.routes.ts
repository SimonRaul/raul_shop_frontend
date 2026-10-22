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
    loadChildren: () =>
      import('./features/shared/shopping-cart/shopping-cart-module').then(
        (m) => m.ShoppingCartModule,
      ),
  },
];
