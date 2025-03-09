
// import { Component, OnInit } from '@angular/core';
// import { FridgeService } from '../../service/fridge.service';
// import { Route, Router } from '@angular/router';
// import { RecipeService } from '../../service/recipe.service';
// import { Recipe } from '../../model/recipe.model';
// import { Product } from '../../model/product.model';
// import { TruncatePipe } from '../../pages/pipes/truncate.pipe';
// import { ChartOptions, ChartType, ChartConfiguration } from 'chart.js';
// import { NgChartsModule } from 'ng2-charts';
// import { CategoryService } from '../../service/category.service';
// import { forkJoin } from 'rxjs';
// import { NoteService } from '../../service/note.service';
// import { AuthService } from '../../service/auth.service';

// @Component({
//   selector: 'app-home-page',
//   imports: [TruncatePipe, NgChartsModule],
//   templateUrl: './home-page.component.html',
//   styleUrl: './home-page.component.css'
// })
// export class HomePageComponent implements OnInit {
//   currentDateTime: string = '19-08-2005';
//   notes: string[] = [];
//   // recipeLink: string = '';
//   currentFridge: any = null;
//   fridgeName: string = '';
//   filteredRecipes: Recipe[] = [];
//   productString: string = '';
//   isLoggedIn:boolean = false;


//   public barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: true
//   };

//   public barChartLabels: string[] = [];
//   public barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: this.barChartLabels,
//     datasets: [
//       { data: [], label: 'כמות מוצרים' }
//     ]
//   };
//   public barChartType: ChartType = 'bar';


//   constructor(private _authService: AuthService,private _fridgeService: FridgeService,
//     private router: Router,
//     private _recipeService: RecipeService,
//     private _categoryService: CategoryService,
//     private _noteService : NoteService
//   ) { }


//   ngOnInit(): void {
//     this._authService.isLoggedIn$.subscribe(status => {
//       this.isLoggedIn = status;
//       if (this.isLoggedIn) {
//         // this.loadFridge();
//       }
//     });
//     this._fridgeService.getFridgeObservable().subscribe(fridge => {
//       this.currentFridge = fridge;
//       this.isLoggedIn = !!this.currentFridge; // ✅ עדכון `isLoggedIn` רק אחרי שהנתונים מתקבלים
  
      
//       if (this.isLoggedIn && this.currentFridge.name) {
//         this.fridgeName = this.currentFridge.name;
//         this.notes = this.currentFridge.notes || [];
//         this.processProducts(this.currentFridge.products || []);
//         this.productString = this.currentFridge.products?.map((pro: Product) => pro.name).join(',') || '';
//         this.fetchRecipesByProducts(this.productString);
//       } else {
//       }
//     });
//   }
  



//   goToLogin() {
//     this.router.navigate(['/login']); // ניתוב לדף ההתחברות
//   }
//   processProducts(products: Product[]) {

//     if (!products || products.length === 0) {
//       return;
//     }

//     const categoryCounts: { [key: string]: number } = {};
//     products.forEach(product => {
//       const categoryID = product.categoryID;
//       categoryCounts[categoryID] = (categoryCounts[categoryID] || 0) + 1;
//     });


//     const categoryRequests = Object.keys(categoryCounts).map(categoryID =>
//       this._categoryService.getCategoryName(Number(categoryID))
//     );

//     forkJoin(categoryRequests).subscribe(categoryNames => {

//       if (!categoryNames || categoryNames.length === 0) {
//         return;
//       }
//       this.barChartLabels = categoryNames;
//       this.barChartData = {
//         labels: this.barChartLabels,
//         datasets: [
//           { data: Object.values(categoryCounts), label: 'כמות מוצרים' }
//         ]
//       };
//     });
//   }


//   fetchRecipesByProducts(productString: string): void {

//     this._recipeService.getRecipeByProductsFromServer(productString,this.currentFridge.id).subscribe({
//       next: (data) => {

//         this.filteredRecipes = data.filter(r => !r.title.toLowerCase().includes('חזיר')).slice(0, 2);
//       },
//       error: (err) => console.error("❌ שגיאה בטעינת מתכונים:", err)
//     });
//   }

//   tothefridge() {
//     this.router.navigate(['/rec']);
//   }

 

//   goToLocation(location: string) {
//     this.router.navigate(['/pro', location]); // ניתוב לדף המוצרים עם `location` שנבחר
//   }
//   tothenote() {
//     this.router.navigate(['/notes']);
//   }

// }









import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FridgeService } from '../../service/fridge.service';
import { Router } from '@angular/router';
import { RecipeService } from '../../service/recipe.service';
import { Recipe } from '../../model/recipe.model';
import { Product } from '../../model/product.model';
import { TruncatePipe } from '../../pages/pipes/truncate.pipe';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CategoryService } from '../../service/category.service';
import { forkJoin } from 'rxjs';
import { NoteService } from '../../service/note.service';
import { AuthService } from '../../service/auth.service';

// הגדרת ממשק לפתקים, אם לא קיים כבר במודל
interface Note {
  type: string;
  text: string;
  isResolved: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, NgChartsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  currentDateTime: string = '';
  notes: Note[] = []; // שינוי מarrayמחרוזותל-arrayשל אובייקטים
  currentFridge: any = null;
  fridgeName: string = '';
  filteredRecipes: Recipe[] = [];
  productString: string = '';
  isLoggedIn: boolean = false;
  expiringSoonCount =0;


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'כמות מוצרים' }
    ]
  };
  public barChartType: ChartType = 'bar';

  constructor(
    private _authService: AuthService, 
    private _fridgeService: FridgeService,
    private router: Router,
    private _recipeService: RecipeService,
    private _categoryService: CategoryService,
    private _noteService: NoteService
  ) { }

  ngOnInit(): void {
    // עדכון התאריך הנוכחי
    this.updateCurrentDateTime();

    // הרשמה למצב ההתחברות
    this._authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // הרשמה לנתוני המקרר רק אם המשתמש מחובר
    this._authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this._fridgeService.getFridgeObservable().subscribe(fridge => {
          this.currentFridge = fridge;
          
          if (this.currentFridge && this.currentFridge.name) {
            this.fridgeName = this.currentFridge.name;
            this.notes = this.currentFridge.notes || [];
            this.processProducts(this.currentFridge.products || []);
            this.productString = this.currentFridge.products?.map((pro: Product) => pro.name).join(',') || '';
            this.fetchRecipesByProducts(this.productString);
          }
        });
      }
    });


  }

  // עדכון התאריך והשעה
  updateCurrentDateTime(): void {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    this.currentDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  goToLogin() {
    this.router.navigate(['/fridge/login']); // עדכון הנתיב לפי המבנה החדש
  } goToSignup() {
    this.router.navigate(['/fridge/signup']); // עדכון הנתיב לפי המבנה החדש
  }

  processProducts(products: Product[]) {
    if (!products || products.length === 0) {
      return;
    }

    const categoryCounts: { [key: string]: number } = {};
    products.forEach(product => {
      const categoryID = product.categoryID;
      categoryCounts[categoryID] = (categoryCounts[categoryID] || 0) + 1;
    });

    const categoryRequests = Object.keys(categoryCounts).map(categoryID =>
      this._categoryService.getCategoryName(Number(categoryID))
    );

    forkJoin(categoryRequests).subscribe(categoryNames => {
      if (!categoryNames || categoryNames.length === 0) {
        return;
      }
      this.barChartLabels = categoryNames;
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          { data: Object.values(categoryCounts), label: 'כמות מוצרים' }
        ]
      };
    });
  }

  fetchRecipesByProducts(productString: string): void {
    if (!productString || !this.currentFridge?.id) {
      this.filteredRecipes = [];
      return;
    }

    this._recipeService.getRecipeByProductsFromServer(productString, this.currentFridge.id).subscribe({
      next: (data) => {
        this.filteredRecipes = data.filter(r => !r.title.toLowerCase().includes('חזיר')).slice(0, 2);
      },
      error: (err) => console.error("❌ שגיאה בטעינת מתכונים:", err)
    });
  }

  tothefridge() {
    this.router.navigate(['/rec']);
  }

  goToLocation(location: string) {
    this.router.navigate(['/pro', location]); // ניתוב לדף המוצרים עם `location` שנבחר
  }

  tothenote() {
    this.router.navigate(['/notes']);
  }

  get fridgeStatus(): string {
    if (this.currentFridge.products.length > 20) return "מלא 📦";
    if (this.currentFridge.products.length > 10) return "חצי ריק 🤔";
    return "צריך קניות 🛒";
  }
  
}