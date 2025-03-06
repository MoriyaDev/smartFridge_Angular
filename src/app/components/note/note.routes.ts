import { Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { AddNoteComponent } from './add-note/add-note.component';

export const NOTE_ROUTES: Routes = [
  { path: '', component: NoteListComponent }, // ברירת מחדל
  { path: 'add', component: AddNoteComponent }
];
