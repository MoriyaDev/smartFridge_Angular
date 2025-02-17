import { Component } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { FridgeService } from '../../fridge/fridge.service';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductDetailsComponent, AddProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  
  // 🔹 משתנים לניהול הנתונים
  products: Product[] = [];
  currentFridge: any = null;
  shelves: any[][] = [];
  selectedProduct: any = null;
  filteredProducts: any[] = []; // מוצרים אחרי סינון
  location: string = 'Fridge'; // ברירת מחדל

  // 🔹 משתנים לניהול המודלים (חלונות קופצים)
  isModalOpen: boolean = false; // מודל פרטי מוצר
  isAddProductModalOpen: boolean = false; // מודל הוספת מוצר

  constructor(
    private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _router: Router,
    private route: ActivatedRoute // נוסיף את `ActivatedRoute` כדי לקבל פרמטרים מהנתיב
  ) {}
  // 🔹 אתחול הנתונים של המקרר והמוצרים בעת טעינת הקומפוננטהngOnInit() {
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        this.location = params.get('location') || 'Fridge'; // אם אין פרמטר, ברירת מחדל: מקרר
        console.log("🔹 מיקום נבחר:", this.location);
        this.filterProducts();
        this.organizeProducts();
      });
    
      this._fridgeService.getFridgeObservable().subscribe(fridge => {
        if (fridge) {
          this.currentFridge = fridge;
          this.products = [...fridge.products]; // יוצרים עותק חדש
          this.filterProducts();
        }
      });
    }
  filterProducts() {
    this.filteredProducts = this.products.filter(p => p.location == this.location);
    this.organizeProducts();
  }

  // 🔹 ארגון מוצרים למדפים עם גודל קבוע לכל מדף
  organizeProducts() {
    const shelfSize = 8; // מספר מוצרים בכל מדף
    this.shelves = [];
    for (let i = 0; i < this.filteredProducts.length; i += shelfSize) {
      this.shelves.push(this.filteredProducts.slice(i, i + shelfSize));
    }
  }

  // 🔹 הצגת מודל פרטי מוצר
  showDetails(product: any) {
    console.log("Product selected:", product);
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  // 🔹 סגירת מודל פרטי מוצר
  closeModal() {
    this.isModalOpen = false;
  }

  // 🔹 פתיחה/סגירה של מודל הוספת מוצר
  toggleAddProductModal() {
    this.isAddProductModalOpen = !this.isAddProductModalOpen;
  }

  // 🔹 כאשר מוצר נוסף, נסגור את המודל של ההוספה
  handleProductAdded() {
    this.isAddProductModalOpen = false;
  }


  // 🔹 מיפוי תמונות רקע לכל קטגוריה
  categoryBackgrounds: { [key: string]: string } = {
    1: "1.png",
    2: "2.png",
    3: "3.png",
    4: "4.png",
    5: "5.png",
    6: "6.png",
    7: "7.png",
    8: "8.png",
  };

  // 🔹 קבלת תמונת רקע לפי קטגוריה
  getCategoryBackground(categoryID: string): string {
    return this.categoryBackgrounds[categoryID] 
      ? `url('${this.categoryBackgrounds[categoryID]}')` 
      : `url('assets/7.png')`; // תמונת ברירת מחדל
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // מציג: יום/חודש/שנה
  }

  deleteProduct(productId: number) {
    console.log("🔵 התקבלה בקשת מחיקה למוצר עם ID:", productId);
  
    this._productService.deleteProductFromServer(productId).subscribe({
      next: () => {
        console.log('✅ המוצר נמחק בהצלחה מהשרת!', productId);
        
        // 🔥 עדכון רשימת המוצרים לאחר מחיקה
        this.products = this.products.filter((p: Product) => p.id !== productId);
        console.log("📌 רשימת מוצרים לאחר מחיקה:", this.products);
  
        // 🔄 עדכון המקרר
        let fridge = JSON.parse(localStorage.getItem("selectedFridge") || "{}");
        fridge.products = fridge.products.filter((p: Product) => p.id !== productId);
        localStorage.setItem("selectedFridge", JSON.stringify(fridge));
  
        // 🔥 עדכון `BehaviorSubject` כדי שכל הרכיבים יתעדכנו
        this._fridgeService.setFridge(fridge);
      },
      error: (error) => {
        console.error('❌ שגיאה במחיקת המוצר מהשרת:', error);
      }
    });
  }
  
  
  
  
}
