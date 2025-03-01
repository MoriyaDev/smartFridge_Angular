import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBackgroundByType]'
})
export class BackgroundByTypeDirective implements OnChanges {
  @Input('appBackgroundByType') noteType!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    let bgColor = 'transparent';
    let borderColor = 'transparent';

    switch (this.noteType) {
      case 'תזכורת':
        bgColor = '#d1f4ff'; // רקע תכלת
        borderColor = '#00bcd4'; // גבול כחול
        break;
      case 'משימה':
        bgColor = '#d1ffd1'; // רקע ירוק
        borderColor = '#4caf50'; // גבול ירוק כהה
        break;
      case 'אירוע':
        bgColor = '#ffd1d1'; // רקע אדום בהיר
        borderColor = '#f44336'; // גבול אדום כהה
        break;
      default:
        bgColor = '#'; // ברירת מחדל
        borderColor = '#666';
    }

    // שינוי צבע רקע
    this.renderer.setStyle(this.el.nativeElement, 'background', bgColor);
    this.renderer.setStyle(this.el.nativeElement, 'border-left', `5px solid ${borderColor}`);
    this.renderer.setStyle(this.el.nativeElement, 'padding', '10px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '6px');
    this.renderer.setStyle(this.el.nativeElement, 'transition', '0.3s');
  }
}
