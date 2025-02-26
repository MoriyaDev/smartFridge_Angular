
import { Component, OnInit } from '@angular/core';
import { FridgeService } from '../service/fridge.service';
import { Route, Router } from '@angular/router';
import { RecipeService } from '../service/recipe.service';
import { Recipe } from '../model/recipe.model';
import { Product } from '../model/product.model';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { ChartOptions, ChartType, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CategoryService } from '../service/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [TruncatePipe,NgChartsModule ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  currentDateTime: string='19-08-2005';
  notes: string[] = [];
  recipeLink: string = '';
  currentFridge: any = null;
  fridgeName: string = '';
  filteredRecipes: Recipe[] = [];
  productString: string = '';



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



  constructor(private _fridgeService: FridgeService,
    private router: Router,
    private _recipeService :RecipeService,
    private _categoryService: CategoryService
  ) {}


  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();
    console.log("Loaded fridge from service:", this.currentFridge);

    if (this.currentFridge && this.currentFridge.name) {
      this.fridgeName = this.currentFridge.name;
      this.notes = this.currentFridge.notes;
      this.processProducts(this.currentFridge.products);

      this.productString = this.currentFridge.products.map((pro: Product) => pro.name).join(',');
      this.fetchRecipesByProducts(this.productString);
      this.recipeLink = `https://www.food2fork.com/search?q=${this.fridgeName}`;
    } else {
      console.log("No fridge found or fridge has no name.");
    }
  }



  processProducts(products: Product[]) {
    console.log("🔄 התחלת עיבוד מוצרים...", products);
  
    if (!products || products.length === 0) {
      console.log("⚠️ אין מוצרים לעיבוד!");
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
    this._recipeService.getRecipeByProductsFromServer(productString).subscribe({
      next: (data) => {
        this.filteredRecipes = data.filter(r => !r.title.toLowerCase().includes('חזיר')).slice(0, 2); 
        console.log("filteredRecipes",this.filteredRecipes.slice(0,1));
        // קבלת 2 מתכונים בלבד
      },
      error: () => console.error('שגיאה בטעינת מתכונים')
    });
  }
  tothefridge(){
    this.router.navigate(['/rec']);
  }

  totheFridgePro(){
    this.router.navigate(['/pro']);
  } 
 
goToLocation(location: string) {
  this.router.navigate(['/pro', location]); // ניתוב לדף המוצרים עם `location` שנבחר
}
  tothenote(){
    this.router.navigate(['/notes']);
  }

}









