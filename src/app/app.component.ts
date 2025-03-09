import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NavbarComponent } from '../app/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentFridge: any = null;

  // ✅ הזרקת ה-TitleService בקונסטרקטור
  constructor(private titleService: Title) {}

  ngOnInit() {
    const savedFridge = localStorage.getItem('selectedFridge');
    if (savedFridge) {
      this.currentFridge = JSON.parse(savedFridge);
      this.titleService.setTitle(` מקרר חכם - מוריה  (${this.currentFridge.name}) `);
    } else {
      this.titleService.setTitle('מקרר חכם - מוריה');
    }
  }
}
