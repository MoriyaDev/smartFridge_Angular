import { Routes } from '@angular/router';
import { SignupFridgeComponent } from './signup-fridge/signup-fridge.component';
import { LoginFridgeComponent } from './login-fridge/login-fridge.component';
import { AuthGuard } from '../../pages/auth.guard';

export const FRIDGE_ROUTES: Routes = [
  { path: 'signup', 
    component: SignupFridgeComponent 
  },
  { path: 'login', 
    component: LoginFridgeComponent 

  }
];
