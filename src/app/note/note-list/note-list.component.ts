import { Component } from '@angular/core';
import { Note } from '../../model/note.model';
import { NoteService } from '../../service/note.service';
import { AddNoteComponent } from "../add-note/add-note.component";
import { FridgeService } from '../../service/fridge.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [AddNoteComponent,CommonModule],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.css'
})
export class NoteListComponent {
  notes: Note[] = [];
  showAddNote: boolean = false;
  currentFridge: any = null;
  products: Product[] =[];

  
  constructor(private _noteService: NoteService,
    private _fridgeService: FridgeService,

  ) {
  }

  ngOnInit() {
    this._fridgeService.getFridgeObservable().subscribe(fridge => {
      if (fridge) {
        this.currentFridge = fridge;
        this.notes = fridge.notes;
        this.products=fridge.products;
        this.checkExpirations();


      }
    });
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

    toggleAddNote() {
    // פעולות לפתיחת/סגירת מודל הוספת פתק
  }

  markAsDone(note: Note): boolean {
    // פעולה לסימון פתק כבוצע
    return true;
  }

  
  checkExpirations() {
    const now = new Date();
    let expiringPassNames: string[] = [];
    let expiringSoonNames: string[] = [];
  
    // מחשבים את המוצרים שפגו תוקף או הולכים לפוג בקרוב
    this.products.forEach(product => {
      const expiryDate = new Date(product.expiryDate);
      if (expiryDate < now) {
        expiringPassNames.push(product.name);
      } else {
        const diffDays = (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 3) {
          expiringSoonNames.push(product.name);
        }
      }
    });
  
    console.log("expiringSoonNames", expiringSoonNames);
    console.log("expiringPassNames", expiringPassNames);
  
    // מסירים את הפתקים הישנים מסוג "התראת מקרר" מהרשימה
    this.notes = this.notes.filter(note => note.type !== '⚠️התראת מקרר');
  
    // מוסיפים פתקים חדשים בהתאם לתוצאות
    if (expiringSoonNames.length > 0) {
      this.notes.push({
        id: 0, // במידה ואין מזהה, אפשר להגדיר ערך חדש
        text: `יש לשים לב ש ${expiringSoonNames.join(", ")} הולכים לפוג תוקף בקרוב`,
        createdDate: new Date().toDateString(),
        type: '⚠️התראת מקרר',
        fridgeId: this.currentFridge ? this.currentFridge.id : 0,
        isResolved: false
      });
    }
  
    if (expiringPassNames.length > 0) {
      this.notes.push({
        id: 0,
        text: `יש לשים לב ש ${expiringPassNames.join(", ")} פג תוקף`,
        createdDate: new Date().toDateString(),
        type: '⚠️התראת מקרר',
        fridgeId: this.currentFridge ? this.currentFridge.id : 0,
        isResolved: false
      });
    }
  }
  
  

}




