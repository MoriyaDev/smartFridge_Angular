import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import {FooterComponent } from './footer/footer.component';
import {NavbarComponent } from './navbar/navbar.component';
//product

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    NavbarComponent,

],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  currentFridge: any = null;

  ngOnInit() {
    const savedFridge = localStorage.getItem('selectedFridge');
    if (savedFridge) {
      this.currentFridge = JSON.parse(savedFridge);
    }
  }
  title = 'smartFridge_Angular';
}
