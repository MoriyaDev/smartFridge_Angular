import { Component, OnDestroy } from '@angular/core';
import { Recipe } from '../../../model/recipe.model';
import { RecipeService } from '../../../service/recipe.service';
import { FridgeService } from '../../../service/fridge.service';
import { Product } from '../../../model/product.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
 import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
  imports: [CommonModule,AddRecipeComponent ],
})
export class RecipeListComponent implements OnDestroy {
  recipes1: Recipe[] = [];
  recipes2: Recipe[] = [];
  currentFridge: any = null;
  isLoading: boolean = false;
  filteredRecipes: Recipe[] = [];
  productString: string = '';
  products: Product[] = [];
  isRecipeModalOpen: boolean = false; // משתנה לשליטה על הצגת המודל

  private fridgeSubscription!: Subscription; // ✅ משתנה לשמירת המנוי

  constructor(
    private _recipeService: RecipeService,
    private _fridgeService: FridgeService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();

    if (this.currentFridge && this.currentFridge.products) {
      this.refreshRecipes(this.currentFridge.products);
    }

    // ✅ האזנה לכל שינוי במוצרים במקרר ורענון המתכונים בהתאם
    this.fridgeSubscription = this._fridgeService.getFridgeProductsObservable().subscribe((products: Product[]) => {
      console.log("🔄 קיבלנו עדכון מהמקרר, טוען מחדש את המתכונים!", products);
      this.refreshRecipes(products);
    });
  }

  openRecipeModal() {
    console.log("🔹 נפתח מודל הוספת מתכון!");
    this.isRecipeModalOpen = true;
  }
  
  closeRecipeModal() {
    console.log("🔹 נסגר מודל הוספת מתכון!");
    this.isRecipeModalOpen = false;
  }
  
  // ✅ פונקציה לרענון רשימת המתכונים לפי המוצרים התקפים
  refreshRecipes(products: Product[]) {
    this.products = products;
    this.productString = products
    .filter(pro => {
      const expiryDate = new Date(pro.expiryDate);
      const today = new Date();
    
      // ✅ מאפסים את השעה כדי להשוות רק לפי תאריך
      expiryDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
    
      return expiryDate >= today;
    })
        .map(pro => pro.name)
      .join(',');

    console.log("🔄 מוצרים תקפים:", this.productString);

    if (this.productString) {
      this.fetchRecipesByProducts(this.productString);
    } else {
      console.log("⚠️ אין מוצרים תקפים, אין מתכונים להצגה.");
      this.filteredRecipes = [];
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
    this._recipeService.getRecipeByProductsFromServer(productString,this.currentFridge.id).subscribe({
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

  // ✅ ביטול המנוי כאשר הקומפוננטה נסגרת כדי למנוע זליגת זיכרון
  ngOnDestroy(): void {
    if (this.fridgeSubscription) {
      this.fridgeSubscription.unsubscribe();
    }
  }
}
