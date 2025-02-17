
import { Component, OnInit } from '@angular/core';
import { FridgeService } from '../fridge/fridge.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  currentDateTime: string='19-08-2005';
  notes: string[] = [];
  recipeLink: string = '';
  currentFridge: any = null;
  fridgeName: string = '';

  constructor(private _fridgeService: FridgeService,private router: Router) {}


  ngOnInit(): void {
    this.currentFridge = this._fridgeService.getFridge();
    console.log("Loaded fridge from service:", this.currentFridge);

    if (this.currentFridge && this.currentFridge.name) {
      this.fridgeName = this.currentFridge.name;
      this.notes = this.currentFridge.notes;
      this.recipeLink = `https://www.food2fork.com/search?q=${this.fridgeName}`;
    } else {
      console.log("No fridge found or fridge has no name.");
    }
  }
  tothefridge(){
    this.router.navigate(['/rec']);
  }

  totheFridgePro(){
    this.router.navigate(['/pro']);
  } 
 
goToLocation(location: string) {
  this.router.navigate(['/pro', location]); // ניתוב לדף המוצרים עם `location` שנבחר
}
  tothenote(){
    this.router.navigate(['/notes']);
  }

}
