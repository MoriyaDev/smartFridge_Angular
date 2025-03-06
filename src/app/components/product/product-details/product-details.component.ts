import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { Product } from '../../../model/product.model';
import {LocationPipe} from '../../../pages/pipes/location.pipe'
import { CategoryService } from '../../../service/category.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule
    ,UpdateProductComponent,LocationPipe
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>(); // שולח את ה-id של המוצר למחיקה
  @Output() updateSuccess = new EventEmitter<Product>(); // ✅ שולח את המוצר המעודכן
  categoryName: string = "טוען...";

  isUpdateFormOpen = false; // שליטה על הצגת טופס העדכון

constructor(private _categoryService: CategoryService){
  
}

  ngOnChanges() {
    if (this.product?.categoryID) {
      this.getCategoryByName(this.product.categoryID); // ✅ מביא את שם הקטגוריה מהשרת
    }
  }
  toggleUpdateForm() {
    this.isUpdateFormOpen = !this.isUpdateFormOpen;
  }

  handleUpdate(updatedProduct: Product) {
    if (updatedProduct) {
      Object.assign(this.product, updatedProduct); // ✅ עדכון הנתונים במסך
      this.isUpdateFormOpen = false; // ✅ סגירת המודל אחרי עדכון
    
      // 🔥 שולח את המוצר המעודכן לרשימת המוצרים (ProductListComponent)
      this.updateSuccess.emit(updatedProduct);
    }
  }
  

  getCategoryByName(categoryID: number): void {
    this._categoryService.getCategoryName(categoryID).subscribe({
      next: (categoryName) => {
        this.categoryName = categoryName; // ✅ שומר את שם הקטגוריה
      },
      error: () => {
        this.categoryName = "קטגוריה לא ידועה"; // ✅ טיפול במקרה של שגיאה
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
  
  categoryBackgrounds: { [key: string]: string } = {
    1: "1.png",
    2: "2.png",
    3: "3.png",
    4: "4.png",
    5: "5.png",
    6: "6.png",
    7: "7.png",
    8: "8.png",
  };

  // 🔹 קבלת תמונת רקע לפי קטגוריה
  getCategoryBackground(categoryID: string): string {
    return this.categoryBackgrounds[categoryID] 
      ? `url('${this.categoryBackgrounds[categoryID]}')` 
      : `url('assets/7.png')`; // תמונת ברירת מחדל
  }

  deleteProduct() {
    if (confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
        this.delete.emit(this.product.id); 
        this.closeModal();
    }
  }

  
}
