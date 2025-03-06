
// import {  Routes } from '@angular/router';

// import { NoteListComponent } from './note/note-list/note-list.component';
// import { AddNoteComponent } from './note/add-note/add-note.component';
// import {HomePageComponent} from './home-page/home-page.component'
// import { FooterComponent } from './footer/footer.component';
// import {SignupFridgeComponent} from './fridge/signup-fridge/signup-fridge.component';
// import { LoginFridgeComponent } from './fridge/login-fridge/login-fridge.component';
// import {ProductListComponent} from './product/product-list/product-list.component';
// import {ProductDetailsComponent} from './product/product-details/product-details.component';
// import {RecipeListComponent} from './recipe/recipe-list/recipe-list.component';


// export const routes: Routes = [
//   { path: '', redirectTo: "home", pathMatch: "full"}, 
//   { path: 'home', component: HomePageComponent },
//   { path: 'footer', component: FooterComponent },

//   { path: 'signup', component: SignupFridgeComponent},
//   { path: 'login', component: LoginFridgeComponent},

//   { path: 'notes', component: NoteListComponent },
//   { path: 'add-note', component: AddNoteComponent },

//   { path: 'pro/:location', component: ProductListComponent },
//   { path: 'proD', component: ProductDetailsComponent},

//   {path: 'rec', component:RecipeListComponent}


  
//   ];


import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProjectOverviewComponent } from './pages/project-overview/project-overview.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'project', component: ProjectOverviewComponent},

  { 
    path: 'notes',
    loadChildren: () => import('../app/components/note/note.routes').then(m => m.NOTE_ROUTES)
  },

  { 
    path: 'pro',
    loadChildren: () => import('../app/components/product/product.routes').then(m => m.PRODUCT_ROUTES)
  },

  { 
    path: 'rec',
    loadChildren: () => import('../app/components/recipe/recipe.routes').then(m => m.RECIPE_ROUTES)
  },

  { 
    path: 'fridge',
    loadChildren: () => import('../app/components/fridge/fridge.routes').then(m => m.FRIDGE_ROUTES)
  },

  { path: '**', redirectTo: 'home' }
];



