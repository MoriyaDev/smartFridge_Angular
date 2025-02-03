// import { Component, OnInit } from '@angular/core';
// import  {FridgeService} from '../fridge/fridge.service';

// @Component({
//   selector: 'app-home-page',
//   imports: [],
//   templateUrl: './home-page.component.html',
//   styleUrl: './home-page.component.css'
// })
// export class HomePageComponent implements OnInit {
//    currentFridge: any = null;
//    fridgeName: string = '0';


 
//   constructor(private _fridgeService: FridgeService) {}
//   ngOnInit(): void {
//     this.currentFridge = this._fridgeService.getFridge();
//     console.log("Loaded fridge from service:", this.currentFridge);    console.log(this.currentFridge.name);
//     if (this.currentFridge) {
//       this.fridgeName = this.currentFridge.fridgeName;
//     } else {
//       console.log("No fridge found");
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FridgeService } from '../fridge/fridge.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  currentFridge: any = null;
  fridgeName: string = '';

  constructor(private _fridgeService: FridgeService) {}

  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();
    console.log("Loaded fridge from service:", this.currentFridge);

    if (this.currentFridge && this.currentFridge.name) {
      this.fridgeName = this.currentFridge.name;
    } else {
      console.log("No fridge found or fridge has no name.");
    }
  }
}
