import { Subscription } from 'rxjs';


import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Recipe } from '../../../model/recipe.model';
import { Product } from '../../../model/product.model';
import { RecipeService } from '../../../service/recipe.service';
import { FridgeService } from '../../../service/fridge.service';
import { AuthService } from '../../../service/auth.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { ChatComponent } from '../../chat/chat.component'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
  imports: [CommonModule, AddRecipeComponent,
    FormsModule,
    ChatComponent],
})

export class RecipeListComponent implements OnDestroy {

  recipes1: Recipe[] = [];
  recipes2: Recipe[] = [];
  currentFridge: any = null;
  isLoading: boolean = false;
  filteredRecipes: Recipe[] = [];
  productString: string = '';
  products: Product[] = [];
  isRecipeModalOpen: boolean = false;

  isAdmin: boolean = false;

  private fridgeSubscription!: Subscription;

  constructor(
    private _recipeService: RecipeService,
    private _fridgeService: FridgeService,
    private _authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();

    if (this.currentFridge && this.currentFridge.products) {
      this.refreshRecipes(this.currentFridge.products);
    }

    this.fridgeSubscription = this._fridgeService.getFridgeProductsObservable().subscribe((products: Product[]) => {
      this.refreshRecipes(products);
    });
    this.isAdmin = this._authService.isAdmin();

  }

  openRecipeModal() {
    this.isRecipeModalOpen = true;
  }

  closeRecipeModal() {
    this.isRecipeModalOpen = false;
  }

  refreshRecipes(products: Product[]) {
    this.products = products;
    this.productString = products
      .filter(pro => {
        const expiryDate = new Date(pro.expiryDate);
        const today = new Date();

        expiryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return expiryDate >= today;
      })
      .map(pro => pro.name)
      .join(',');


    if (this.productString) {
      this.fetchRecipesByProducts(this.productString);
    } else {
      this.filteredRecipes = [];
    }
  }

  fetchRecipesApiByProducts(productString: string): void {
    this.isLoading = true;
    this._recipeService.getRecipeByProductsApiFromServer(productString).subscribe({
      next: (data) => {
        this.recipes2 = data;

        this.filteredRecipes = this.recipes2.filter(r =>
          !r.title.toLowerCase().includes('חזיר') ||
          !r.usedIngredients.some(ingredient => ingredient.name.toLowerCase().includes('חזיר'))
        );

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  fetchRecipesByProducts(productString: string): void {
    this.isLoading = true;
    this._recipeService.getRecipeByProductsFromServer(productString, this.currentFridge.id).subscribe({
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

  ngOnDestroy(): void {
    if (this.fridgeSubscription) {
      this.fridgeSubscription.unsubscribe();
    }
  }




}
