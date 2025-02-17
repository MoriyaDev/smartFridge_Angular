import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<number>(); // שולח את ה-id של המוצר למחיקה



  ngOnChanges() {
    console.log("isOpen:", this.isOpen); // נוודא שהמפתח הזה משתנה
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
  };

  // 🔹 קבלת תמונת רקע לפי קטגוריה
  getCategoryBackground(categoryID: string): string {
    return this.categoryBackgrounds[categoryID] 
      ? `url('${this.categoryBackgrounds[categoryID]}')` 
      : `url('assets/7.png')`; // תמונת ברירת מחדל
  }
  deleteProduct() {
    console.log("🔴 לוחצים על כפתור מחיקה במודל!");
    
    if (confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
      console.log("📌 שולח את ה-ID למחיקה:", this.product?.id);
      
      if (this.delete) {
        console.log("✅ אירוע מחיקה קיים במודל, שולח ל-parent...");
        this.delete.emit(this.product.id); // שולח את ה-ID לקומפוננטה הראשית
      } else {
        console.error("❌ אירוע מחיקה (delete) לא קיים!");
      }
  
      this.closeModal(); // סוגר את המודל
    }
  }
  
  
}
