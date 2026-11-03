import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/components/container/product-list/product-list.component';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { ProductsFormComponent } from './features/products/components/container/products-form/products-form.component';
import { ShoppingCartDetailsComponent } from './features/shopping-cart/components/container/shopping-cart-details/shopping-cart-details.component';
import { LoginFormComponent } from './features/auth/components/container/login-form/login-form.component';
import { ProductDetailsComponent } from './features/products/components/container/product-details/product-details.component';
import { ProfileComponent } from './features/user/components/container/profile/profile.component';
import { CheckoutPageComponent } from './features/checkout/components/container/checkout-page/checkout-page.component';
import { NotFoundPageViewComponent } from './features/shared/components/presentational/not-found-page-view/not-found-page-view.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products/new',
    component: ProductsFormComponent,
    canActivate: [authGuard, adminGuard],
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
