import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locationTranslate'
})
export class LocationPipe implements PipeTransform {
  transform(value: string): string {
    const locationMap: { [key: string]: string } = {
      'Fridge': 'מקרר',
      'Freezer': 'מקפיא'
    };
    return locationMap[value] || value; 
  }
}
