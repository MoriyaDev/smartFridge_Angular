import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../model/product.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../service/fridge.service';
import { ProductService } from '../../service/product.service';
import { JsonPipe, NgIf } from '@angular/common';
import { CategoryService } from '../../service/category.service';
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
    this.addProductForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'fridgeId': new FormControl(this.currentFridge?.id, Validators.required),
      'categoryID': new FormControl(this.categories.length > 0 ? this.categories[0].id : '', Validators.required), // ✅ ברירת מחדל
      // 'amount': new FormControl('', Validators.required),
      // 'unit': new FormControl('', Validators.required),
      // 'image': new FormControl('', Validators.required),
      // 'purchaseDate': new FormControl('', Validators.required),
      'expiryDate': new FormControl('', Validators.required),
      'location': new FormControl('Fridge', Validators.required) // ✅ ברירת מחדל = מקרר
    });
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
    console.log("📌 טופס בעת יצירה:", this.addProductForm.value);

    const newProduct = this.addProductForm.value;

    // ✅ בדיקה האם המוצר כבר קיים במקרר
    const existingProduct = this.currentFridge.products.find(
      (p: Product) => p.name.toLowerCase() === newProduct.name.toLowerCase()
    );


    if (existingProduct) {
      // ⚠️ המוצר כבר קיים - נשאל את המשתמש אם הוא רוצה להוסיף בכל זאת
      if (!confirm(`🔴 המוצר "${newProduct.name}" כבר נמצא במקרר! להוסיף בכל זאת?`)) {
        console.log("❌ המשתמש ביטל את הוספת המוצר.");
        return; // 🛑 לא שולחים לשרת אם המשתמש בחר שלא להוסיף
      }
    }

    // ✅ שליחת המוצר לשרת
    this._productService.addProductFromServer(newProduct).subscribe({
      next: (data) => {
        console.log('✅ מוצר נוסף בהצלחה:', data);

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
        console.error('❌ שגיאה בהוספת מוצר:', error);
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
