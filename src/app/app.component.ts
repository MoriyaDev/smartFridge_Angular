import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AddNoteComponent } from './note/add-note/add-note.component';
//note

import { NoteListComponent } from './note/note-list/note-list.component';
//frigde
import { SignupFridgeComponent } from "./fridge/signup-fridge/signup-fridge.component";
//normal
import {HomePageComponent} from './home-page/home-page.component'
import {FooterComponent } from './footer/footer.component';
import {NavbarComponent } from './navbar/navbar.component';
//product
import {ProductListComponent} from './product/product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NoteListComponent,
    HomePageComponent,
    FooterComponent,
    AddNoteComponent,
    NavbarComponent,
    SignupFridgeComponent,
    ProductListComponent,
],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'smartFridge_Angular';
}
