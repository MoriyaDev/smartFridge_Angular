import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../../model/product.model';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FridgeService } from '../../../service/fridge.service';
import { ProductService } from '../../../service/product.service';
import { JsonPipe, NgIf } from '@angular/common';
import { CategoryService } from '../../../service/category.service';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  public addProductForm!: FormGroup;
  currentFridge: any = null;
  @Output() productAdded = new EventEmitter<void>(); // יצירת אירוע כאשר מוצר נוסף
  categories: { id: number, name: string }[] = []; // רשימת קטגוריות מהדאטה בייס
  isConfirmOpen: boolean = false; // האם להציג את המודל
  productToAdd: any = null; // המוצר שהמשתמש רוצה להוסיף


  constructor(private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _categoryService: CategoryService) { }

  ngOnInit() {
    this._fridgeService.getFridgeObservable().subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
        this.loadCategories();

      }
    });

  }

  createForm() {
    const defaultCategory = this.categories.length > 0 ? this.categories[0].id : 1;

    this.addProductForm = new FormGroup({
      'name': new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]),
      'fridgeId': new FormControl<number | null>(this.currentFridge?.id ?? null, Validators.required),
      'categoryID': new FormControl<string | number>(this.categories.length > 0 ? this.categories[0].id : 'שונות', Validators.required),
      'expiryDate': new FormControl(this.getExpiryDateByCategory(defaultCategory), Validators.required),
      'location': new FormControl<string>('Fridge', Validators.required)
    });
  }
  

  getExpiryDateByCategory(categoryID: number): string {
    const daysToAddMap: { [key: number]: number } = {
      1: 5,
      2: 20,
      3: 8,
      4: 8,
      5: 70,
      6: 4,
      7: 20,
      8: 60
    };
  
    const daysToAdd = daysToAddMap[categoryID] || 10; // ברירת מחדל אם הקטגוריה לא מוכרת
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0]; // פורמט yyyy-mm-dd
  }

  
  // ✅ פונקציה שמונעת בחירת תאריך תפוגה בעבר
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // אם השדה ריק, לא נבצע בדיקה
  
    const today = new Date().toISOString().split('T')[0];
    return control.value < today ? { 'pastDate': true } : null; // ודא שהמפתח pastDate הוא string
  }
  

  loadCategories() {
    this._categoryService.getCategoriesFromServer().subscribe({
      next: (data) => {
        this.categories = data;
        this.createForm();
      }
    });
  }

  addProduct() {

    const newProduct = this.addProductForm.value;

    // ✅ בדיקה האם המוצר כבר קיים במקרר
    const existingProduct = this.currentFridge.products.find(
      (p: Product) => p.name.toLowerCase() === newProduct.name.toLowerCase()
    );


    if (existingProduct) {
      // ⚠️ המוצר כבר קיים - נשאל את המשתמש אם הוא רוצה להוסיף בכל זאת
      if (!confirm(`🔴 המוצר "${newProduct.name}" כבר נמצא במקרר! להוסיף בכל זאת?`)) {
        return; // 🛑 לא שולחים לשרת אם המשתמש בחר שלא להוסיף
      }
    }

    // ✅ שליחת המוצר לשרת
    this._productService.addProductFromServer(newProduct).subscribe({
      next: (data) => {

        // ✅ עדכון המקרר והוספת המוצר
        this.currentFridge.products.push(data);
        let fridge = JSON.parse(localStorage.getItem("selectedFridge") || "{}");
        fridge.products = fridge.products || [];
        fridge.products.push(data);
        localStorage.setItem("selectedFridge", JSON.stringify(fridge));
        this._fridgeService.setFridge(fridge);

        // 🔄 איפוס הטופס אחרי הוספה
        this.addProductForm.reset({
          name: '',
          fridgeId: this.currentFridge.id,
          categoryID: '',
          expiryDate: '',
          location: ''
        });

        // 🔥 שליחת אירוע שהמוצר נוסף
        this.productAdded.emit();
      },
      error: (error) => {
      }
    });
  }

  trackByCategoryId(index: number, category: any): number {
    return category.id;
  }

  onCategoryChange(event: any) {
    const selectedCategory = event.target.value;
    this.addProductForm.patchValue({ categoryID: +selectedCategory }); // המרה ל-Number
    console.log("📌 קטגוריה שנבחרה:", selectedCategory);
  this.addProductForm.patchValue({
    categoryID: selectedCategory,
    expiryDate: this.getExpiryDateByCategory(selectedCategory) // עדכון אוטומטי
  });
}



}
