import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const PRODUCT_ROUTES: Routes = [
  { path: ':location', component: ProductListComponent }, // /pro/fridge או /pro/freezer
  { path: 'details', component: ProductDetailsComponent }
];
