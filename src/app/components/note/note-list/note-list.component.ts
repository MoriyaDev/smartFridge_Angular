import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../../model/product.model';
import { Note } from '../../../model/note.model';
import { FridgeService } from '../../../service/fridge.service';
import { NoteService } from '../../../service/note.service';
import { AddNoteComponent } from "../add-note/add-note.component";
import { BackgroundByTypeDirective } from '../../../pages/directives/background-by-type.directive'

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [AddNoteComponent, CommonModule, BackgroundByTypeDirective],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})

export class NoteListComponent {

  notes: Note[] = [];
  showAddNote: boolean = false;
  currentFridge: any = null;
  products: Product[] = [];


  constructor(private _noteService: NoteService,
    private _fridgeService: FridgeService,) {
  }

  ngOnInit() {
    this._fridgeService.getFridgeObservable().subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
        this.getNotessByFridgeId(this.currentFridge.id);
        this.products = fridge.products;
      }
    });
  }


  getNotessByFridgeId(id: number) {
    this._noteService.getNotesByFridgeIdFromServer(id).subscribe({

      next: (notes: Note[]) => {
        this.notes = notes; 
        this.notes = notes
          .filter(note => note.isResolved == false)
          .reverse();
        this.checkExpirations();

      },
      error: (err) => {
        console.error("❌ שגיאה בטעינת המוצרים מהשרת", err);
      }
    });

  }


  formattedDate(note: any): string {
    const [year, month, day] = new Date(note.createdDate).toISOString().split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  toggleAddNote() {
    this.showAddNote = !this.showAddNote;
    console.log("🔄 מצב מודל הוספת פתק:", this.showAddNote);
  }


  deleteNote(noteId: number) {
    this._noteService.delNoteFromServer(noteId).subscribe(() => {
      this.notes = this.notes ? this.notes.filter(note => note.id !== noteId) : [];

      if (this.notes.length > 1) {
        this.getNotessByFridgeId(this.currentFridge.id);
      }
    });

  }


  getExpiryIndicator(dateInput: string | Date): number {
    const expiryDate = new Date(dateInput); 
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) {
      return -1; 
    } else if (diffDays <= 3) {
      return 0;
    }
    return 1;
  }


  checkExpirations() {
    let expiringPassNames: string[] = [];
    let expiringSoonNames: string[] = [];

    this.products.forEach(product => {
      const expiryStatus = this.getExpiryIndicator(product.expiryDate);

      if (expiryStatus === -1) {
        expiringPassNames.push(product.name);
      } else if (expiryStatus === 0) {
        expiringSoonNames.push(product.name);
      }
    });

    this.notes = this.notes.filter(note => note.type !== '⚠️התראת מקרר' || note.fridgeId !== this.currentFridge.id);
    if (expiringSoonNames.length > 0) {
      this.notes.push({
        id: 0,
        tit: 'המוצרים הבאים עומדים לפוג בקרוב',
        text: `${expiringSoonNames.join(", ")}`,
        createdDate: new Date().toDateString(),
        type: '⚠️התראת מקרר',
        fridgeId: this.currentFridge ? this.currentFridge.id : 0,
        isResolved: false
      });
    }

    if (expiringPassNames.length > 0) {
      this.notes.push({
        id: 0,
        tit: ' מוצרים שפג תוקפם!',
        text: `${expiringPassNames.join(",")}`,
        createdDate: new Date().toDateString(),
        type: '⚠️התראת מקרר',
        fridgeId: this.currentFridge ? this.currentFridge.id : 0,
        isResolved: false
      });
    }
  }



}




