import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { AuthGuard } from '../../pages/auth.guard';

export const RECIPE_ROUTES: Routes = [
  { path: '', 
    component: RecipeListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'add-recipe', 
    component: AddRecipeComponent ,
    canActivate: [AuthGuard]
  }

];
