import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateProductComponent } from '../update-product/update-product.component';
import { Product } from '../../../model/product.model';
import { LocationPipe } from '../../../pages/pipes/location.pipe'
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule
    , UpdateProductComponent, LocationPipe
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent {

  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>(); 
  @Output() updateSuccess = new EventEmitter<Product>(); 
  categoryName: string = "טוען...";
  isUpdateFormOpen = false;

  constructor(private _categoryService: CategoryService) {
  }

  ngOnChanges() {
    if (this.product?.categoryID) {
      this.getCategoryByName(this.product.categoryID);
    }
  }
  toggleUpdateForm() {
    this.isUpdateFormOpen = !this.isUpdateFormOpen;
  }

  handleUpdate(updatedProduct: Product) {
    if (updatedProduct) {
      Object.assign(this.product, updatedProduct); 
      this.isUpdateFormOpen = false; 
      this.updateSuccess.emit(updatedProduct);
    }
  }


  getCategoryByName(categoryID: number): void {
    this._categoryService.getCategoryName(categoryID).subscribe({
      next: (categoryName) => {
        this.categoryName = categoryName; 
      },
      error: () => {
        this.categoryName = "קטגוריה לא ידועה";
      }
    });
  }



  closeModal() {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }


  getCategoryBackground(categoryID: string): string {
    return `url('${categoryID}.png')` ?`url('${categoryID}.png')`:`url('7.png')`;
  }
  
  deleteProduct() {
    if (confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
      this.delete.emit(this.product.id);
      this.closeModal();
    }
  }


}
