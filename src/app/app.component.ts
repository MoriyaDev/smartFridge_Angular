import { Component } from '@angular/core';
import { NoteListComponent } from './note/note-list/note-list.component';
import { AddNoteComponent } from './note/add-note/add-note.component';
import {HomePageComponent} from './home-page/home-page.component'
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
@Component({
  selector: 'app-root',
  imports: [
    NoteListComponent,
     HomePageComponent,
      FooterComponent,
      AddNoteComponent,
      NavbarComponent, 
    ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'smartFridge_Angular';
}
