import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { FridgeService } from '../../fridge/fridge.service';
import { AddProductComponent } from "../add-product/add-product.component";
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core'; @Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductDetailsComponent, AddProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  isShow: boolean = false
  currentFridge: any = null;
  showAddProduct: boolean = false;
  shelves: any[][] = [];
  selectedProduct: any = null;
  isModalOpen: boolean = false;



  constructor(private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.currentFridge = this._fridgeService.getFridge();
    this.products = this.currentFridge.products;
    this.organizeProducts();

    // console.log("Loaded fridge from service:", this.currentFridge);   

    // if (this.currentFridge) {
    //   this.fridgeId = this.currentFridge.id;
    // } else {
    //   console.log("No fridge found");
    // }   
    //  this.getProductsByFridgeId(this.fridgeId);
  }
  organizeProducts() {
    const shelfSize = 8;
    this.shelves = [];
    for (let i = 0; i < this.products.length; i += shelfSize) {
      this.shelves.push(this.products.slice(i, i + shelfSize));
    }
  }

  // getProductsByFridgeId(id: number): void {
  //   this._productService.getProductsByFridgeIdFormServer(id).subscribe({
  //     next: (data) => {
  //       this.products = data;
  //     },
  //     error: (error) => {
  //       console.error('Error retrieving products', error);
  //     }
  //   });
  // }
  showDetails(product: any) {
    console.log("Product selected:", product); // לוודא שהמוצר נבחר
    this.selectedProduct = product;
    this.isModalOpen = true;  // תוודאי שזה משתנה
    console.log("isModalOpen:", this.isModalOpen); // לוודא שהשדה משתנה
  }

  closeModal() {
    this.isModalOpen = false;
  }
  categoryColors: { [key: string]: string } = {
    1: "#AEDFF7", // מוצרי חלב - כחול בהיר
    2: "#FFADAD", // בשר - אדום בהיר
    3: "#B5E48C", // ירקות - ירוק
    6: "#FFDD57", // פירות - צהוב
    5: "#CBA6F7", // שתייה - סגול
    8: "#D9D9D9" // כללי - אפור
  };
  categoryBackgrounds: { [key: string]: string } = {
    1: "1milk.jpg", 
    2: "2meat.jpg", 
    3: "3v.jpg", 
    4: "4f.jpg" ,
    5: "5d.jpg",
    6: "6all.jpg" 

  };

  getCategoryBackground(categoryID: string): string {
    return this.categoryBackgrounds[categoryID] 
      ? `url('${this.categoryBackgrounds[categoryID]}')` 
      : `url('assets/milk.jpg')`; // תיקון בתמונה ברירת המחדל
    }
  


  getCategoryColor(categoryID: string): string {
    return this.categoryColors[categoryID] || this.categoryColors["others"];
  }
  categoryIcons: { [key: string]: string } = {
    1: "🥛", // מוצרי חלב - בקבוק חלב
    2: "🍖", // בשר - נתח בשר
    3: "🥕", // ירקות - גזר
    4: "🍎", // פירות - תפוח
    5: "🥤", // שתייה - כוס שתייה
    6: "🛒" // כללי - עגלה
  };

  getCategoryIcon(categoryID: string): string {
    return this.categoryIcons[categoryID] || this.categoryIcons["others"];
  }





}
