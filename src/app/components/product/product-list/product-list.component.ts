import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AddProductComponent } from "../add-product/add-product.component";
import { Product } from '../../../model/product.model';
import { NoteService } from '../../../service/note.service';
import { CategoryService } from '../../../service/category.service';
import { FridgeService } from '../../../service/fridge.service';
import { ProductService } from '../../../service/product.service';
import { LocationPipe } from '../../../pages/pipes/location.pipe';
import { ExpiryHighlightDirective } from '../../../pages/directives/expiry-highlight.directive'

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, LocationPipe, ProductDetailsComponent, AddProductComponent, ExpiryHighlightDirective],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  currentFridge: any = null;
  shelves: any[][] = [];
  selectedProduct: any = null;
  filteredProducts: any[] = [];
  location: string = 'Fridge';
  categories: { id: number, name: string }[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  isLightOn: boolean = true;
  lightDots = Array(15).fill(0);


  isShabbatMode: boolean = false;
  isModalOpen: boolean = false; 
  isAddProductModalOpen: boolean = false; 

  constructor(
    private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _router: Router,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private _categoryService: CategoryService  
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const newLocation = params.get('location') || 'Fridge';
      if (this.location !== newLocation) {
        this.location = newLocation;
        this.filterProducts();
      }
    });

    this.getPro();
    this.loadCategories();

  }

  toggleAddProductModal() {
    this.isAddProductModalOpen = !this.isAddProductModalOpen;
  }

  handleProductAdded() {
    this.isAddProductModalOpen = false;
  }

  toggleLight() {
    this.isLightOn = !this.isLightOn;
  }

  getPro() {
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
      },
      error: (err) => {
        console.error("❌ שגיאה בטעינת הקטגוריות מהשרת", err);
      }
    });
  }

  onProductUpdated(updatedProduct: Product) {

    this.products = this.products.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    );

    this.filterProducts(); 
    this.isModalOpen = false; 
  }

  getProductsByFridgeId(id: number) {
    this._productService.getProductsByFridgeIdFromServer(id).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filterProducts();

      },
      error: (err) => {
        console.error("❌ שגיאה בטעינת המוצרים מהשרת", err);
      }
    });

  }

  filterProducts() {
    this.filteredProducts = this.products
      .filter(p => p.location == this.location) 
      .filter(p => this.selectedCategory ? p.categoryID == Number(this.selectedCategory) : true) 
      .filter(p => this.searchQuery ? p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true); 
    this.organizeProducts(); 
  }


  organizeProducts() {
    const shelfSize = 8;
    this.shelves = [];
    for (let i = 0; i < this.filteredProducts.length; i += shelfSize) {
      this.shelves.push(this.filteredProducts.slice(i, i + shelfSize));
    }
  }

  showDetails(product: any) {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getCategoryBackground(categoryID: string): string {
    return `url('${categoryID}.png')` ?`url('${categoryID}.png')`:`url('7.png')`;
  }

  getExpiryIndicator(dateString: string): number {

    const expiryDate = new Date(dateString);
    const today = new Date();

    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) {
      return -1;  
    } else if (diffDays <= 3) {
      return 0;  
    }
    return 1;
  }


  deleteProduct(productId: number) {
    this._productService.deleteProductFromServer(productId).subscribe({
      next: () => {

        if (this.currentFridge?.id) {
          this.getProductsByFridgeId(this.currentFridge.id);
        } else {
          console.warn("⚠️ המקרר לא נטען עדיין, לא ניתן לרענן מוצרים.");
        }
      },
      error: (error) => {
        console.error('❌ שגיאה במחיקת המוצר מהשרת:', error);
      }
    });

  }



}



