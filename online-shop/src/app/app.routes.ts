import { Routes } from '@angular/router';
import {ProductDetailsComponent} from './components/containers/product-details/product-details.component';

export const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'products',
    loadComponent: () => import('./components/containers/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  }
];
