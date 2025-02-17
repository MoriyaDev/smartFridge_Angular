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
  isLoading: boolean = false;  // משתנה שיציין אם אנחנו עדיין בטעינה
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
console.log("filteredRecipes",this.filteredRecipes);

        this.isLoading = false; // סיום טעינה
      },
      error: (error) => {
        console.error('Error retrieving recipes', error);
        this.isLoading = false; // סיום טעינה גם במקרה של שגיאה
      }
    });
  }

  getRecipesbyExpiration(products: Product[]) {
    if (!products || products.length === 0) {
        console.warn('אין מוצרים לשלוח לשרת.');
        return;
    }

    this.isLoading = true; 
    this._recipeService.getRecipesByExpirationFromServer(products).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
            console.warn('לא נמצאו מתכונים מתאימים.');
        } else {
            this.recipes = data;
        }
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('שגיאה בקבלת מתכונים מהשרת:', error);
        this.isLoading = false; 
      }
    });
}

  


}
