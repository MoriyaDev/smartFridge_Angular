import { Component } from '@angular/core';
import { Recipe } from '../../model/recipe.model';
import { RecipeService } from '../../service/recipe.service';
import { FridgeService } from '../../service/fridge.service';
import { Product } from '../../model/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
  imports: [CommonModule ],
})
export class RecipeListComponent {
  recipes1: Recipe[] = [];
  recipes2: Recipe[] = [];
  currentFridge: any = null;
  isLoading: boolean = false;
  filteredRecipes: Recipe[] = [];
  productString: string = '';
  products: Product[] = [];
  constructor(private _recipeService: RecipeService,
    private _fridgeService: FridgeService) { }

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();

    if (this.currentFridge && this.currentFridge.products) {
      this.products = this.currentFridge.products;
      this.productString = this.products.map(pro => pro.name).join(',');
      console.log(this.productString);
      this.fetchRecipesByProducts(this.productString);
    } else {
      console.warn('No products found in fridge');
      this.isLoading = false; // סיום טעינה גם אם אין מוצרים
    }
  }

  fetchRecipesApiByProducts(productString: string): void {
    this.isLoading = true; 
    this._recipeService.getRecipeByProductsApiFromServer(productString).subscribe({
      next: (data) => {
        this.recipes2 = data;
        this.filteredRecipes = this.recipes2.filter(r => !r.title.toLowerCase().includes('חזיר'));
        this.isLoading = false; 
      },
      error: (error) => {
        this.isLoading = false; 
      }
    });
  }

  fetchRecipesByProducts(productString: string): void {
    this.isLoading = true; 
    this._recipeService.getRecipeByProductsFromServer(productString).subscribe({
      next: (data) => {
        this.recipes1 = data;
        this.filteredRecipes = this.recipes1.filter(r => !r.title.toLowerCase().includes('חזיר'));
        this.isLoading = false; 
      },
      error: () => {
        this.isLoading = false; 
      }
    });
  }






}
