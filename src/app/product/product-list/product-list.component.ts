import { Component } from '@angular/core';
import { Product } from '../../model/product.model';
import { ProductService } from '../../service/product.service';
import { Router } from '@angular/router';
import { FridgeService } from '../../service/fridge.service';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { NoteService } from '../../service/note.service';
import { Note } from '../../model/note.model';
import { CategoryService } from '../../service/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule,
    ProductDetailsComponent, AddProductComponent],
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
  categories: { id: number, name: string }[] = []; // רשימת קטגוריות מהדאטה בייס
  searchQuery: string = ''; // 🔍 טקסט לחיפוש מוצרים
  selectedCategory: string = ''; // 📂 מזהה קטגוריה מסוננת
  isLightOn: boolean = true; // נורה דולקת כברירת מחדל
  lightDots = Array(15).fill(0); // יצירת 8 נקודות לנורה
  
  
    isShabbatMode: boolean = false; // ברירת מחדל: מצב חול
  
  
  


  // 🔹 משתנים לניהול המודלים (חלונות קופצים)
  isModalOpen: boolean = false; // מודל פרטי מוצר
  isAddProductModalOpen: boolean = false; // מודל הוספת מוצר

  constructor(
    private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _router: Router,
    private noteService: NoteService,
    private route: ActivatedRoute  ,
    private _categoryService :CategoryService  // נוסיף את `ActivatedRoute` כדי לקבל פרמטרים מהנתיב
  ) { }
  // 🔹 אתחול הנתונים של המקרר והמוצרים בעת טעינת הקומפוננטהngOnInit() {
    ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const newLocation = params.get('location') || 'Fridge';
    
        if (this.location !== newLocation) {
          this.location = newLocation;
          this.filterProducts(); // ✅ Trigger filtering when location changes
        }
      });
    
      
      this.getPro();
      this.loadCategories();
      

    }

 
    toggleLight() {
      this.isLightOn = !this.isLightOn;
    }
    

    getPro(){
      this._fridgeService.getFridgeObservable().subscribe(fridge => {
        if (fridge) {
          this.currentFridge = fridge;
          this.getProductsByFridgeId(this.currentFridge.id);
        }
      });

    }
    loadCategories() {
      this._categoryService.getCategoriesFromServer().subscribe({
        next: (data) => {
          this.categories = data;
          console.log("✅ קטגוריות שהתקבלו מהשרת:", this.categories);
        },
        error: (err) => {
          console.error("❌ שגיאה בטעינת הקטגוריות מהשרת", err);
        }
      });
    }
    
    onProductUpdated(updatedProduct: Product) {
      console.log("🔄 עדכון מוצר ברשימה מיידית:", updatedProduct);
      console.log("🌛🌛✨❄️⚠️⚠️❄️💓🍓💐👶🏿💐💓");

      // 🔹 עדכון מיידי של הרשימה מבלי לרענן מהשרת
      this.products = this.products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      );
    
      this.filterProducts(); // ✅ עדכון התצוגה ללא ריענון מלא
      this.isModalOpen = false; // ✅ סגירת מודל פרטי מוצר
    }

    
    
    
    
    
    


  getProductsByFridgeId(id: number) {
    this._productService.getProductsByFridgeIdFromServer(id).subscribe({
      next: (products: Product[]) => {
        this.products = products; // ✅ שמירת הנתונים לאחר קבלת התשובה
        console.log(this.products);
        this.filterProducts();

      },
      error: (err) => {
        console.error("❌ שגיאה בטעינת המוצרים מהשרת", err);
      }
    });

  }

  filterProducts() {
    console.log("🔍 חיפוש:", this.searchQuery, "📂 קטגוריה נבחרה:", this.selectedCategory);
  
    this.filteredProducts = this.products
      .filter(p => p.location == this.location) // ✅ סינון לפי מקרר/מקפיא
      .filter(p => this.selectedCategory ? p.categoryID == Number(this.selectedCategory) : true) // ✅ המרה למספר אם צריך
      .filter(p => this.searchQuery ? p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true); // ✅ חיפוש לפי שם המוצר
  
    console.log("📦 מוצרים מסוננים:", this.filteredProducts);
    this.organizeProducts(); // ✅ ארגון מוצרים על המדפים מחדש
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
    1: "1.png",//חלב
    2: "2.png",//בשר
    3: "3.png",//ירקות
    4: "4.png",//פירות
    5: "5.png",//שתיה
    6: "6.png",//לחם
    7: "7.png",//שונות
    8: "8.png",//נקנקיות
  };

  // 🔹 קבלת תמונת רקע לפי קטגוריה
  getCategoryBackground(categoryID: string): string {
    return this.categoryBackgrounds[categoryID]
      ? `url('${this.categoryBackgrounds[categoryID]}')`
      : `url('assets/7.png')`; // תמונת ברירת מחדל
  }

  getExpiryIndicator(dateString: string): number {
    const expiryDate = new Date(dateString);
    const today = new Date();

    // איפוס השעות, דקות, שניות ומילישניות להשוואה מבוססת ימים בלבד
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // חישוב הפרש הימים
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) {
      return -1;  // המוצר פג תוקפו
    } else if (diffDays <= 3) {
      return 0;  // המוצר עומד לפוג ב-3 הימים הקרובים
    }
    return 1;
  }


  deleteProduct(productId: number) {
    this._productService.deleteProductFromServer(productId).subscribe({
      next: () => {
        console.log("✅ המוצר נמחק בהצלחה");
  
        if (this.currentFridge?.id) {
          this.getProductsByFridgeId(this.currentFridge.id); // ✅ רענון המוצרים לאחר מחיקה
        } else {
          console.warn("⚠️ המקרר לא נטען עדיין, לא ניתן לרענן מוצרים.");
        }
      },
      error: (error) => {
        console.error('❌ שגיאה במחיקת המוצר מהשרת:', error);
      }
    });
  }


  
  


  // deleteProduct(productId: number) {

  //   this._productService.deleteProductFromServer(productId).subscribe({
  //     next: () => {

  //       this.products = this.products.filter((p: Product) => p.id !== productId);

  //       let fridge = JSON.parse(localStorage.getItem("selectedFridge") || "{}");
  //       fridge.products = fridge.products.filter((p: Product) => p.id !== productId);
  //       localStorage.setItem("selectedFridge", JSON.stringify(fridge));

  //       this._fridgeService.setFridge(fridge);
  //     },
  //     error: (error) => {
  //       console.error('❌ שגיאה במחיקת המוצר מהשרת:', error);
  //     }
  //   });
  // }







}
