import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../service/product.service';
import { CommonModule } from '@angular/common';
import { FridgeService } from '../../../service/fridge.service';
import { Product } from '../../../model/product.model';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
  imports: [ReactiveFormsModule]
})
export class UpdateProductComponent implements OnInit, OnChanges {
  @Input() product!: Product; // מקבל את המוצר לעריכה
  @Output() updateSuccess = new EventEmitter<Product>(); // אירוע שמתבצע כאשר המוצר מתעדכן בהצלחה
  @Output() cancel = new EventEmitter<void>(); // אירוע לסגירת המודל

  updateProductForm!: FormGroup;
  currentFridge: any = null; // שמירת המקרר הנוכחי

  constructor(private _productService: ProductService, private _fridgeService: FridgeService) {}

  ngOnInit() {

    // ✅ נוודא שהמקרר נטען **לפני** שנטען הטופס
    this._fridgeService.getFridgeObservable().subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
      }
    });

    this.initForm(); // יצירת הטופס
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && changes['product'].currentValue) {
      console.log("🔄 שינוי במוצר זוהה, טופס מתעדכן!", this.product);

      if (!this.updateProductForm) {
        this.initForm();
      } else {
        this.updateProductForm.patchValue(this.product);
      }
    }
  }

  initForm() {
    this.updateProductForm = new FormGroup({
      name:  new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]),
      // amount: new FormControl('', [Validators.required, Validators.min(1)]),
      // unit: new FormControl('', Validators.required),
      expiryDate:new FormControl('',Validators.required),
      categoryID: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      // image: new FormControl('')
    });

    if (this.product) {
      this.updateProductForm.patchValue({
        ...this.product,
        expiryDate: this.formatDateForInput(this.product.expiryDate) // ✅ שמירה על פורמט תקין
      });
    }
  }

   futureDateValidator(control: AbstractControl): ValidationErrors | null {
      if (!control.value) return null; // אם השדה ריק, לא נבצע בדיקה
    
      const today = new Date().toISOString().split('T')[0];
      return control.value < today ? { 'pastDate': true } : null; // ודא שהמפתח pastDate הוא string
    }
  formatDateForInput(date: any): string {
    if (!date) return ''; // אם אין תאריך, נחזיר מחרוזת ריקה כדי למנוע שגיאות
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  }
  

  updateProduct() {
    if (this.updateProductForm.valid) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.updateProductForm.value,
        expiryDate: new Date(this.updateProductForm.value.expiryDate) // ✅ תאריך בפורמט נכון
      };
  
      this._productService.updateProductFromServer(this.product.id, updatedProduct).subscribe({
        next: (updatedProduct: Product) => {
          console.log("✅ המוצר עודכן בהצלחה!", updatedProduct);
  
          if (this.currentFridge?.id) {
            this._productService.getProductsByFridgeIdFromServer(this.currentFridge.id).subscribe({
              next: (products: Product[]) => {
                console.log("🔄 רשימת המוצרים רועננה!", products);
                this._fridgeService.updateProducts(products); // ✅ עדכון המוצרים ב-FridgeService
  
                this.updateSuccess.emit(updatedProduct);
  
                setTimeout(() => {
                  this.cancel.emit();
                }, 200);
              },
              error: (err) => {
                console.error("❌ שגיאה בטעינת המוצרים מהשרת", err);
              }
            });
          } else {
            this.updateSuccess.emit(updatedProduct);
            setTimeout(() => {
              this.cancel.emit();
            }, 200);
          }
        },
        error: (err) => {
          console.error("❌ שגיאה בעדכון המוצר", err);
        }
      });
    }
  }
  
  
}
