import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors ,ReactiveFormsModule} from '@angular/forms';

import { ProductService } from '../../../service/product.service';
import { FridgeService } from '../../../service/fridge.service';
import { Product } from '../../../model/product.model';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
  imports: [ReactiveFormsModule]
})

export class UpdateProductComponent implements OnInit, OnChanges {

  @Input() product!: Product;
  @Output() updateSuccess = new EventEmitter<Product>(); 
  @Output() cancel = new EventEmitter<void>(); 

  updateProductForm!: FormGroup;
  currentFridge: any = null; 

  constructor(private _productService: ProductService, private _fridgeService: FridgeService) {}

  ngOnInit() {
    this._fridgeService.getFridgeObservable().subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
      }
    });
    this.initForm(); 
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

      expiryDate:new FormControl('',Validators.required),
      categoryID: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
    });

    if (this.product) {
      this.updateProductForm.patchValue({
        ...this.product,
        expiryDate: this.formatDateForInput(this.product.expiryDate) 
      });
    }
  }

   futureDateValidator(control: AbstractControl): ValidationErrors | null {
      if (!control.value) return null;
    
      const today = new Date().toISOString().split('T')[0];
      return control.value < today ? { 'pastDate': true } : null; 
    }
  formatDateForInput(date: any): string {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  }
  

  updateProduct() {
    if (this.updateProductForm.valid) {
      const updatedProduct: Product = {
        ...this.product,
        ...this.updateProductForm.value,
        expiryDate: new Date(this.updateProductForm.value.expiryDate)
      };
  
      this._productService.updateProductFromServer(this.product.id, updatedProduct).subscribe({
        next: (updatedProduct: Product) => {
          console.log("✅ המוצר עודכן בהצלחה!", updatedProduct);
  
          if (this.currentFridge?.id) {
            this._productService.getProductsByFridgeIdFromServer(this.currentFridge.id).subscribe({
              next: (products: Product[]) => {
                console.log("🔄 רשימת המוצרים רועננה!", products);
                this._fridgeService.updateProducts(products); 
  
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
