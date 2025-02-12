import { Component } from '@angular/core';
import { Product } from '../product.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../fridge/fridge.service';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  public addProductForm!: FormGroup;
  currentFridge: any = null;

  constructor(private _productService: ProductService, 
    private _fridgeService: FridgeService) { }

    ngOnInit() {
      this._fridgeService.getFridgeObservable().subscribe(fridge => {
        if (fridge) {
          this.currentFridge = fridge;
          this.createForm(); // יצירת טופס אחרי קבלת המקרר
        }
      });
    }
    
    createForm() {
      this.addProductForm = new FormGroup({
        'name': new FormControl('', Validators.required),
        'fridgeId': new FormControl(this.currentFridge?.id, Validators.required),
        'categoryID': new FormControl('', Validators.required),
        'amount': new FormControl('', Validators.required),
        'unit': new FormControl('', Validators.required),
        'image': new FormControl('', Validators.required),
        'purchaseDate': new FormControl('', Validators.required),
        'expiryDate': new FormControl('', Validators.required),
        'location': new FormControl('', Validators.required)
      });
    }
    

  addProduct() {
    this._productService.addProductFromServer(this.addProductForm.value).subscribe({
      next: (data) => {
        console.log('Product added:', data);
  
        // 1️⃣ עדכון המקרר בזיכרון
        this.currentFridge.products.push(data);
  
        // 2️⃣ עדכון ה-Local Storage
        let fridge = JSON.parse(localStorage.getItem("selectedFridge") || "{}");
        fridge.products = fridge.products || [];
        fridge.products.push(data);
        localStorage.setItem("selectedFridge", JSON.stringify(fridge));
  
        // 3️⃣ 🔥 עדכון `BehaviorSubject` כדי שכל הרכיבים יראו את השינוי
        this._fridgeService.setFridge(fridge);
  
        // 4️⃣ איפוס הטופס
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
      },
      error: (error) => {
        console.error('Error adding product', error);
      }
    });
  }
  

 

}
