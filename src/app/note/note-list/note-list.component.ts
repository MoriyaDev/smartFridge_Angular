import { Component } from '@angular/core';
import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { AddNoteComponent } from "../add-note/add-note.component";
import { FridgeService } from '../../fridge/fridge.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-list',
  imports: [AddNoteComponent,CommonModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
  notes: Note[] = [];
  showAddNote: boolean = false;
  currentFridge: any = null;

  ngOnInit(){

    this.currentFridge = this._fridgeService.getFridge();
    this.notes=this.currentFridge.notes;
    // this.getNotes();
  }

  constructor(private _noteService: NoteService,
    private _fridgeService: FridgeService,

  ) {
  }

  // getNotes() {
  //   this._noteService.getNotesFromServer().subscribe({
  //     next: (data) => {
  //       console.log('Data from server:', data); // בדיקה לנתונים
  //       this.notes = data;
  //     },
  //     error: (error) => {
  //       console.error('Error retrieving notes', error);
  //     }
  //   });
  // }
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
  // getFormattedDate(date: Date): string {
  //   const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
  //   return new Date(date).toLocaleDateString('he-IL', options);
  // }
  
  
  formattedDate(note: any): string {
    const [year, month, day] = new Date(note.createdDate).toISOString().split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }
  
  

}
