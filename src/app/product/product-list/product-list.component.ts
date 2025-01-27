import { Component } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';


@Component({
  selector: 'app-product-list',
  imports: [ProductDetailsComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[]=[];
  isShow: boolean = false



  constructor( private _productService: ProductService,
    private _router: Router
  ) {}
  ngOnInit(){
    this.getProductsByFridgeId(2);
  }

  getProductsByFridgeId(id: number): void {
     this._productService.getProductsByFridgeIdFormServer(id).subscribe({
      next:(data)=>{
        this.products=data;
      },
      error:(error)=>{
        console.error('Error retrieving products', error);
      }
     });
  }
  showDetails(pro :Product) {
    this._router.navigate(['/product-details', pro.id]);  // for navigation with id
  }




}
