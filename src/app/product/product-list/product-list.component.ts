import { Component } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { FridgeService } from '../../fridge/fridge.service';


@Component({
  selector: 'app-product-list',
  imports: [ProductDetailsComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];
  isShow: boolean = false
  // fridgeId: number = -1;
  currentFridge: any = null;



  constructor(private _productService: ProductService,
    private _fridgeService: FridgeService,
    private _router: Router
  ) { }
  
  ngOnInit() {
    this.currentFridge = this._fridgeService.getFridge();
    this.products=this.currentFridge.products;
    // console.log("Loaded fridge from service:", this.currentFridge);   

    // if (this.currentFridge) {
    //   this.fridgeId = this.currentFridge.id;
    // } else {
    //   console.log("No fridge found");
    // }   
  //  this.getProductsByFridgeId(this.fridgeId);
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
  showDetails(pro: Product) {
    this._router.navigate(['/product-details', pro.id]);  // for navigation with id
  }




}
