import { Routes } from '@angular/router';

import { NoteListComponent } from './note-list/note-list.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { AuthGuard } from '../../pages/auth.guard';

export const NOTE_ROUTES: Routes = [
  { path: '',
     component: NoteListComponent,
     canActivate: [AuthGuard]
    }, 
  { path: 'add', 
    component: AddNoteComponent,
    canActivate: [AuthGuard]
  }
];
