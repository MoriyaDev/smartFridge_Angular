
import {  Routes } from '@angular/router';

import { NoteListComponent } from './note/note-list/note-list.component';
import { AddNoteComponent } from './note/add-note/add-note.component';
import {HomePageComponent} from './home-page/home-page.component'
import { FooterComponent } from './footer/footer.component';
import {SignupFridgeComponent} from './fridge/signup-fridge/signup-fridge.component';
import { LoginFridgeComponent } from './fridge/login-fridge/login-fridge.component';
import {ProductListComponent} from './product/product-list/product-list.component';
import {RecipeListComponent} from './recipe/recipe-list/recipe-list.component';
export const routes: Routes = [
  { path: '', redirectTo: "login", pathMatch: "full"}, 
  { path: 'home', component: HomePageComponent },
  { path: 'footer', component: FooterComponent },

  { path: 'signup', component: SignupFridgeComponent},
  { path: 'login', component: LoginFridgeComponent},

  { path: 'notes', component: NoteListComponent },
  { path: 'add-note', component: AddNoteComponent },

  { path: 'pro', component: ProductListComponent },

  {path: 'rec', component:RecipeListComponent}


  
  ];


