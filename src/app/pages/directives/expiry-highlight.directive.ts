import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appExpiryHighlight]'
})
export class ExpiryHighlightDirective implements OnInit {
  @Input() expiryDate!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyHighlight();
  }

  private applyHighlight() {
    const expiryDate = new Date(this.expiryDate);
    const today = new Date();

    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) {
      this.renderer.addClass(this.el.nativeElement, 'expired');
    } else if (diffDays <= 3) {
      this.renderer.addClass(this.el.nativeElement, 'expiring');
    }
  }
}
