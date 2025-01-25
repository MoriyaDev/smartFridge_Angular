import { Component } from '@angular/core';
import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { AddNoteComponent } from "../add-note/add-note.component";

@Component({
  selector: 'app-note-list',
  imports: [AddNoteComponent],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
  notes: Note[] = [];
  showAddNote: boolean = false;
  ngOnInit(){
    this.getNotes();
  }

  constructor(private _noteService: NoteService) {
  }

  getNotes() {
    this._noteService.getNotesFormServer().subscribe({
      next: (data) => {
        console.log('Data from server:', data); // בדיקה לנתונים
        this.notes = data;
      },
      error: (error) => {
        console.error('Error retrieving notes', error);
      }
    });
  }
  //  addNote(note: Note) {
  //   this._noteService.add(note).subscribe({
  //     next: (data) => {
  //       console.log('Data from server:', data); // בדי��ה לנתו��ים
  //       this.notes.push(note);
  //     },
  //     error: (error) => {
  //       console.error('Error adding note', error);
  //     }
  //   });
  // }
  

}
