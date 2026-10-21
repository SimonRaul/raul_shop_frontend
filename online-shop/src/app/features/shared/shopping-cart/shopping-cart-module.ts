import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { shoppingCartRoutes } from './shopping-cart.routes';
import {
  ShoppingCartDetailsView
} from './components/presentational/shopping-cart-details-view/shopping-cart-details-view';
import {
  ShoppingCartDetailsComponent
} from './components/containers/shopping-cart-details/shopping-cart-details.component';

@NgModule({
  declarations: [ShoppingCartDetailsView, ShoppingCartDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(shoppingCartRoutes)],
})
export class ShoppingCartModule {}
