
import {  Routes } from '@angular/router';
import { NoteListComponent } from './note/note-list/note-list.component';
import { AddNoteComponent } from './note/add-note/add-note.component';
import { AppComponent } from './app.component';
import {HomePageComponent} from './home-page/home-page.component'
import { FooterComponent } from './footer/footer.component';

export const routes: Routes = [
  { path: '', component:HomePageComponent }, 
  { path: 'home', component: HomePageComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'add-note', component: AddNoteComponent },
  { path: 'notes', component: NoteListComponent },
  { path: 'add-note', component: AddNoteComponent },
  ];


