import { Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

export const RECIPE_ROUTES: Routes = [
  { path: '', component: RecipeListComponent },
  { path: 'add-recipe', component: AddRecipeComponent }

];
