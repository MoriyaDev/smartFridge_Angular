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
  productString : string='';
  products :Product[] = [];
  constructor(private _recipeService: RecipeService,
              private _fridgeService: FridgeService) {}

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();

    if (this.currentFridge && this.currentFridge.products) {
      this.products = this.currentFridge.products;
      this.productString = this.products.map(pro => pro.name).join(',');
      console.log(this.productString);

    } else {
      console.warn('No products found in fridge');
      this.isLoading = false; // סיום טעינה גם אם אין מוצרים
    }
  }

  getRecipesByProducts(products: string): void {
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

  getRecipesbyExpiration(products :Product[]) {
    this.isLoading = true; 
    this._recipeService.getRecipesByExpirationFromServer(products).subscribe({
      next: (data) => {
        this.recipes = data;
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('Error retrieving recipes', error);
        this.isLoading = false; 
      }
    });

  }

  


}
