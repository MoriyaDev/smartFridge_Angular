import { Component } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { FridgeService } from '../../fridge/fridge.service';
import { Product } from '../../product/product.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent {
  recipes: Recipe[] = [];
  currentFridge: any = null;
  isLoading: boolean = true;  // משתנה שיציין אם אנחנו עדיין בטעינה
  filteredRecipes:Recipe[]=[];
  constructor(private _recipeService: RecipeService,
              private _fridgeService: FridgeService) {}

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();

    if (this.currentFridge && this.currentFridge.products) {
      const products: Product[] = this.currentFridge.products;
      const productString = products.map(pro => pro.name).join(',');
      console.log(productString);
      
      this.getRecipes(productString);
    } else {
      console.warn('No products found in fridge');
      this.isLoading = false; // סיום טעינה גם אם אין מוצרים
    }
  }

  getRecipes(products: string): void {
    this.isLoading = true; // מתחילים טעינה
    this._recipeService.getRecipeByProductsFromServer(products).subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = this.recipes.filter(r => !r.title.toLowerCase().includes('חזיר'));

        this.isLoading = false; // סיום טעינה
      },
      error: (error) => {
        console.error('Error retrieving recipes', error);
        this.isLoading = false; // סיום טעינה גם במקרה של שגיאה
      }
    });
  }
}
