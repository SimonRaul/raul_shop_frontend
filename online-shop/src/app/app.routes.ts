import { Routes } from '@angular/router';
import { ProductListComponent } from './components/containers/product-list/product-list.component';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/containers/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'shopping-cart',
    loadComponent: () =>
      import('./features/shared/shopping-cart/components/containers/shopping-cart-details/shopping-cart-details.component').then(
        (m) => m.ShoppingCartDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./components/containers/products-form/products-form.component').then(
        (m) => m.ProductsFormComponent,
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./components/containers/products-form/products-form.component').then(
        (m) => m.ProductsFormComponent,
      ),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/shared/components/containers/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/containers/login-form/login-form.component').then(
        (m) => m.LoginFormComponent,
      ),
    canActivate: [guestGuard],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
