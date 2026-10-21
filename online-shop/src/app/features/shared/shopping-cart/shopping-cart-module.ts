import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ShoppingCartDetailsView
} from './components/presentational/shopping-cart-details-view/shopping-cart-details-view';
import {
  ShoppingCartDetailsComponent
} from './components/containers/shopping-cart-details/shopping-cart-details.component';

@NgModule({
  declarations: [ShoppingCartDetailsView, ShoppingCartDetailsComponent],
  imports: [CommonModule],
})
export class ShoppingCartModule {}
