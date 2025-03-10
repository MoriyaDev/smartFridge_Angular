import { Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AuthGuard } from '../../pages/auth.guard';

export const PRODUCT_ROUTES: Routes = [
  { path: ':location', 
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'details', 
    component: ProductDetailsComponent,
      canActivate: [AuthGuard]
  }
];
