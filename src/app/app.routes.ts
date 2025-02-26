
import {  Routes } from '@angular/router';

import { NoteListComponent } from './note/note-list/note-list.component';
import { AddNoteComponent } from './note/add-note/add-note.component';
import {HomePageComponent} from './home-page/home-page.component'
import { FooterComponent } from './footer/footer.component';
import {SignupFridgeComponent} from './fridge/signup-fridge/signup-fridge.component';
import { LoginFridgeComponent } from './fridge/login-fridge/login-fridge.component';
import {ProductListComponent} from './product/product-list/product-list.component';
import {ProductDetailsComponent} from './product/product-details/product-details.component';
import {RecipeListComponent} from './recipe/recipe-list/recipe-list.component';
// import { UpdateProductComponent } from './product/update-product/update-product.component';


export const routes: Routes = [
  { path: '', redirectTo: "home", pathMatch: "full"}, 
  { path: 'home', component: HomePageComponent },
  { path: 'footer', component: FooterComponent },

  { path: 'signup', component: SignupFridgeComponent},
  { path: 'login', component: LoginFridgeComponent},

  { path: 'notes', component: NoteListComponent },
  { path: 'add-note', component: AddNoteComponent },

  { path: 'pro/:location', component: ProductListComponent },
  { path: 'proD', component: ProductDetailsComponent},
  // { path: 'proUpdate', component: UpdateProductComponent},

  {path: 'rec', component:RecipeListComponent}


  
  ];


