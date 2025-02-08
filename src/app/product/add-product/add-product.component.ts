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
    this.currentFridge = this._fridgeService.getFridge();

    this.addProductForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'fridgeId': new FormControl(this.currentFridge.id, Validators.required),
      'categoryID': new FormControl('', Validators.required),
      'amount': new FormControl('', Validators.required),
      'unit': new FormControl('', Validators.required),
      'imageUrl': new FormControl('', Validators.required),
      'purchaseDate': new FormControl('', Validators.required),
      'expiryDate': new FormControl('', Validators.required),
      'location': new FormControl('', Validators.required)
    });
  }

  addProduct() {
    this._productService.addProductFromServer(this.addProductForm.value).subscribe({
      next: (data) => {
        console.log('Product added:', data);

        this.currentFridge.products.push(data);
        this.addProductForm.reset(
          {
            name: '',
            fridgeId: this.currentFridge.id,
            categoryID: '',
            amount: '',
            unit: '',
            imageUrl: '',
            purchaseDate: '',
            expiryDate: '',
            location: ''
          }
        );
      },
      error: (error) => {
        console.error('Error adding product', error);
      }
    })
  }

 

}
