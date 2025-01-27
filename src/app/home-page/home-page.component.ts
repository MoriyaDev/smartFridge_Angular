import { Component, OnInit } from '@angular/core';
import  {FridgeService} from '../fridge/fridge.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
   fridgeName: string='Fridge';

 
  constructor(private _fridgeService: FridgeService) {}
  ngOnInit(): void {
    this.fridgeName = this._fridgeService.getFridgeName();
    
  }
}

