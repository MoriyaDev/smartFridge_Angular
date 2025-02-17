import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../product.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../fridge/fridge.service';
import { ProductService } from '../product.service';
import { JsonPipe,NgIf } from '@angular/common';
@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule,JsonPipe, NgIf],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  public addProductForm!: FormGroup;
  currentFridge: any = null;
  @Output() productAdded = new EventEmitter<void>(); // יצירת אירוע כאשר מוצר נוסף
  categories: { id: number, name: string }[] = []; // רשימת קטגוריות מהדאטה בייס


  constructor(private _productService: ProductService, 
    private _fridgeService: FridgeService) { }

    ngOnInit() {
      this._fridgeService.getFridgeObservable().subscribe(fridge => {
        if (fridge) {
          this.currentFridge = fridge;
          this.loadCategories();

        }
      });

    }
    
    createForm() {
      this.addProductForm = new FormGroup({
        'name': new FormControl('', Validators.required),
        'fridgeId': new FormControl(this.currentFridge?.id, Validators.required),
        'categoryID': new FormControl(this.categories.length > 0 ? this.categories[0].id : '', Validators.required), // ✅ ברירת מחדל
        'amount': new FormControl('', Validators.required),
        'unit': new FormControl('', Validators.required),
        'image': new FormControl('', Validators.required),
        'purchaseDate': new FormControl('', Validators.required),
        'expiryDate': new FormControl('', Validators.required),
        'location': new FormControl('', Validators.required)
      });
    }
    
    loadCategories() {
      this._productService.getCategoriesFromServer().subscribe({
        next: (data) => {
          this.categories = data;
          console.log("✅ קטגוריות שהתקבלו:", this.categories);
    
          // 🔥 בדיקה אם הרשימה לא ריקה
          if (this.categories.length > 0) {
            console.log("📌 יש קטגוריות, בונים את הטופס עכשיו.");
          } else {
            console.log("❌ אין קטגוריות, משהו השתבש.");
          }
    
          // רק עכשיו יוצרים את הטופס
          this.createForm();
        },
        error: (error) => {
          console.error('❌ שגיאה בטעינת קטגוריות', error);
        }
      });
    }
    

  addProduct() {
    console.log("טופס בעת יצירה:", this.addProductForm.value);
    
    this._productService.addProductFromServer(this.addProductForm.value).subscribe({
      next: (data) => {
        console.log('Product added:', data);

        // עדכון הנתונים במקרר
        this.currentFridge.products.push(data);
        let fridge = JSON.parse(localStorage.getItem("selectedFridge") || "{}");
        fridge.products = fridge.products || [];
        fridge.products.push(data);
        localStorage.setItem("selectedFridge", JSON.stringify(fridge));
        this._fridgeService.setFridge(fridge);

        // איפוס הטופס
        this.addProductForm.reset({
          name: '',
          fridgeId: this.currentFridge.id,
          categoryID: '',
          amount: '',
          unit: '',
          image: '',
          purchaseDate: '',
          expiryDate: '',
          location: ''
        });

        // 🔥 שליחת אירוע שהמוצר נוסף
        this.productAdded.emit();
      },
      error: (error) => {
        console.error('Error adding product', error);
      }
    });
  }
  trackByCategoryId(index: number, category: any): number {
    return category.id;
  }
  
  onCategoryChange(event: any) {
    const selectedCategory = event.target.value;
    console.log("📌 קטגוריה שנבחרה:", selectedCategory);
    this.addProductForm.patchValue({ categoryID: +selectedCategory }); // המרה ל-Number
  }
  
 

}
