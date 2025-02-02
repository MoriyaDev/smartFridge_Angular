import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {
  recipes: Recipe[] = [];

  constructor(private _recipeService: RecipeService){

  }

  ngOnInit(): void {
    this.getRecipes("apple");
    // this.getRecipes("apple,milk,orange,chicken,choked");
  }

  getRecipes(products:string):void{
    this._recipeService.getRecipeByProductsFromServer(products).subscribe({
      next: (data) => {
        this.recipes = data;
      },
      error: (error) => {
        console.error('Error retrieving recipes', error);
      }
    })
  }

}
