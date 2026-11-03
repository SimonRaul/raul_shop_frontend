import { Routes } from '@angular/router';
import { ProductListComponent } from './components/containers/product-list/product-list.component';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { guestGuard } from './guards/guest-guard';
import { ProductsFormComponent } from './components/containers/products-form/products-form.component';
import { ShoppingCartDetailsComponent } from './features/shared/shopping-cart/components/containers/shopping-cart-details/shopping-cart-details.component';
import { LoginFormComponent } from './components/containers/login-form/login-form.component';
import { ProductDetailsComponent } from './components/containers/product-details/product-details.component';
import { ProfileComponent } from './features/shared/components/containers/profile/profile.component';
import { CheckoutPageComponent } from './features/shared/components/containers/checkout-page/checkout-page.component';
import { NotFoundPageViewComponent } from './features/shared/components/presentational/not-found-page-view/not-found-page-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products/:id/edit',
    component: ProductsFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'products/new',
    component: ProductsFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginFormComponent,
    canActivate: [guestGuard],
  },
  {
    path: '**',
    component: NotFoundPageViewComponent,
  },
];
