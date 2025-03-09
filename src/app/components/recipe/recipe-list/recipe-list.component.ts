import { Component, OnDestroy } from '@angular/core';
import { Recipe } from '../../../model/recipe.model';
import { RecipeService } from '../../../service/recipe.service';
import { FridgeService } from '../../../service/fridge.service';
import { Product } from '../../../model/product.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
  imports: [CommonModule, AddRecipeComponent, FormsModule],
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
  isAdmin: boolean = false;

  private fridgeSubscription!: Subscription; // ✅ משתנה לשמירת המנוי

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

    // ✅ האזנה לכל שינוי במוצרים במקרר ורענון המתכונים בהתאם
    this.fridgeSubscription = this._fridgeService.getFridgeProductsObservable().subscribe((products: Product[]) => {
      console.log("🔄 קיבלנו עדכון מהמקרר, טוען מחדש את המתכונים!", products);
      this.refreshRecipes(products);
    });
      this.isAdmin = this._authService.isAdmin();

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
  
        // ✅ סינון מתכונים שגם שמם וגם המרכיבים שלהם לא מכילים "חזיר"
        this.filteredRecipes = this.recipes2.filter(r => 
          !r.title.toLowerCase().includes('חזיר') ||
          !r.usedIngredients.some(ingredient => ingredient.name.toLowerCase().includes('חזיר'))
        );
  
        this.isLoading = false; 
      },
  error: (error) => {
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

// ✅ ביטול המנוי כאשר הקומפוננטה נסגרת כדי למנוע זליגת זיכרון
ngOnDestroy(): void {
  if(this.fridgeSubscription) {
  this.fridgeSubscription.unsubscribe();
}
  }





  

  isChatOpen: boolean = false;
  chatMessages: { text: string, sender: string }[] = [];
  isLoading1: boolean = false;

  // נתונים לבחירה: מוצרים ויחידות
  productsI = ["קמח", "סוכר", "שמן", "אבקת אפייה", "חלב", "מלח"];
  units = ["כף", "כוס", "כפית", "ליטר", "מ\"ל", "גרם"];
  selectedAmount: number = 1;
  selectedProductI: string = "";
  selectedUnit: string = "";

  // טבלת המרות: לכל מוצר יש ערכים בכל יחידה
  conversionData: Record<string, Record<string, number>> = {
    "קמח": { "כוס": 120, "כף": 10, "כפית": 3, "גרם": 1 },
    "סוכר": { "כוס": 200, "כף": 15, "כפית": 5, "גרם": 1 },
    "שמן": { "כוס": 240, "כף": 15, "כפית": 5, "מ\"ל": 1 },
    "חלב": { "כוס": 250, "כף": 15, "כפית": 5, "מ\"ל": 1, "ליטר": 1000 },
    "מלח": { "כוס": 230, "כף": 18, "כפית": 6, "גרם": 1 }
  };

  // פתיחה/סגירה של הצ'אט
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;

    if (this.isChatOpen && this.chatMessages.length === 0) {
      this.chatMessages.push({ text: "שלום! בחר כמות, מוצר ויחידה להמרה.", sender: 'bot' });
    }
  }

  // חישוב כל ההמרות האפשריות למוצר שנבחר
  convertMeasurement(): string {
    if (!this.selectedProductI || !this.selectedUnit) {
      return "⚠ יש לבחור מוצר ויחידה לפני החישוב.";
    }

    const conversion = this.conversionData[this.selectedProductI]; // המרות של המוצר
    if (!conversion) return "🤷‍♂️ לא מצאתי את ההמרה.";

    let response = `${this.selectedAmount} ${this.selectedUnit} של ${this.selectedProductI} שווה ל:\n`;

    // המרת הכמות לכל היחידות
    const baseValue = this.selectedAmount * (conversion[this.selectedUnit] || 1); // המרה ליחידת הבסיס
    for (let unit in conversion) {
      if (unit !== this.selectedUnit) {
        const convertedValue = baseValue / conversion[unit];
        response += `▪️${convertedValue.toFixed(2)} ${unit}\n`;
      }
    }

    return response.trim();
  }

  // שליחת בקשה לאחר בחירה
  async sendMessage() {
    if (!this.selectedProductI || !this.selectedUnit || !this.selectedAmount) {
      return;
    }

    this.chatMessages.push({
      text: `${this.selectedAmount} ${this.selectedUnit} של ${this.selectedProductI}`,
      sender: 'user'
    });

    this.isLoading1 = true;

    setTimeout(() => {
      const botResponse = this.convertMeasurement();
      this.chatMessages.push({ text: botResponse, sender: 'bot' });

      this.isLoading1 = false;
    }, 1000);
  }



}
