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

  ngOnChanges() {
    console.log("isOpen:", this.isOpen); // נוודא שהמפתח הזה משתנה
  }

  closeModal() {
    this.close.emit();
  }
}
