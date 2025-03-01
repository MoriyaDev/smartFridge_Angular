import { Component } from '@angular/core';
import { Note } from '../../model/note.model';
import { NoteService } from '../../service/note.service';
import { AddNoteComponent } from "../add-note/add-note.component";
import { FridgeService } from '../../service/fridge.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';
import  {BackgroundByTypeDirective } from '../../directives/background-by-type.directive'
@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [AddNoteComponent,CommonModule,BackgroundByTypeDirective],
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
         this.getNotessByFridgeId(this.currentFridge.id);
        this.products=fridge.products;


      }
    });
  }

 
  getNotessByFridgeId(id: number) {
    console.log("note=======",id);
    this._noteService.getNotesByFridgeIdFromServer(id).subscribe({
      
      next: (notes: Note[]) => {
        this.notes = notes; // ✅ שמירת הנתונים לאחר קבלת התשובה
        this.notes = notes
        .filter(note => note.isResolved==false)
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

      if (this.notes.length >1) {
        this.getNotessByFridgeId(this.currentFridge.id);
      }    
      console.log("�� הפתק ��מחק בהצלחה");
    });

  }



  
  
  getExpiryIndicator(dateInput: string | Date): number {
    const expiryDate = new Date(dateInput); // המרה ל- Date במקרה של מחרוזת
    const today = new Date();

    // איפוס השעות, דקות, שניות ומילישניות להשוואה מבוססת ימים בלבד
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // חישוב הפרש הימים
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 0) {
        return -1;  // המוצר פג תוקפו
    } else if (diffDays <= 3) {
        return 0;  // המוצר עומד לפוג ב-3 הימים הקרובים
    }
    return 1;
}

  
checkExpirations() {
  let expiringPassNames: string[] = [];
  let expiringSoonNames: string[] = [];

  this.products.forEach(product => {
      const expiryStatus = this.getExpiryIndicator(product.expiryDate);
      console.log(`🔍 בדיקת מוצר: ${product.name}, expiryStatus: ${expiryStatus}, expiryDate: ${product.expiryDate}`);

      if (expiryStatus === -1) {
          console.log(`❌ ${product.name} כבר פג תוקפו`);
          expiringPassNames.push(product.name);
      } else if (expiryStatus === 0) {
          console.log(`⚠️ ${product.name} עומד לפוג בקרוב`);
          expiringSoonNames.push(product.name);
      }
  });

  console.log("📋 expiringSoonNames:", expiringSoonNames);
  console.log("📋 expiringPassNames:", expiringPassNames);

  // מסירים פתקים ישנים מסוג "התראת מקרר"
  this.notes = this.notes.filter(note => note.type !== '⚠️התראת מקרר' || note.fridgeId !== this.currentFridge.id);

  // הוספת פתקים חדשים בהתאם למצב המוצרים
  if (expiringSoonNames.length > 0) {
      this.notes.push({
          id: 0,
          text: `⚠️ שים לב! המוצרים הבאים עומדים לפוג בקרוב: ${expiringSoonNames.join(", ")}`,
          createdDate: new Date().toDateString(),
          type: '⚠️התראת מקרר',
          fridgeId: this.currentFridge ? this.currentFridge.id : 0,
          isResolved: false
      });
  }

  if (expiringPassNames.length > 0) {
      this.notes.push({
          id: 0,
          text: `❌ שים לב! המוצרים הבאים כבר פגו תוקפם: ${expiringPassNames.join(", ")}`,
          createdDate: new Date().toDateString(),
          type: '⚠️התראת מקרר',
          fridgeId: this.currentFridge ? this.currentFridge.id : 0,
          isResolved: false
      });
  }
}


  
  
  

}




