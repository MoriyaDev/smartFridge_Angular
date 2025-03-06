import { Component, EventEmitter, Output } from '@angular/core';
import { Note } from '../../../model/note.model';
import { NoteService } from '../../../service/note.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../../service/fridge.service';


@Component({
  selector: 'app-add-note',
  imports: [ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css'
})
export class AddNoteComponent {
  public addNoteForm!: FormGroup;
  currentFridge: any = null;
  @Output() noteAdded = new EventEmitter<void>();


  
    constructor(private _noteService: NoteService,
      private _fridgeService: FridgeService,

    ) {
    }

    
    ngOnInit(): void {
      this.currentFridge = this._fridgeService.getFridge();

      this.addNoteForm = new FormGroup({
        text: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
        type: new FormControl('תזכורת', Validators.required),
        createdDate: new FormControl(this.getTodayDateString()),
        fridgeId: new FormControl(this.currentFridge?.id || 0),
        isResolved: new FormControl(false)
      });
      
    }
    getTodayDateString(): string {
      let today = new Date();
  
      // המרת התאריך לפורמט YYYY-MM-DD (בלי הסטת שעות)
      let offset = today.getTimezoneOffset() * 60000; // התאמת הפרש אזורי זמן
      let localISOTime = new Date(today.getTime() - offset).toISOString().split('T')[0];
  
      return localISOTime;
  }
  
  
    
    @Output() close = new EventEmitter<void>(); // הוספת אירוע לסגירת המודל

closeModal() {
  this.close.emit(); // שולח אירוע שהמודל נסגר
}

addNote() {
  let formValue = { ...this.addNoteForm.value };

  // שמירת התאריך בדיוק כפי שהוזן, בלי הסטה
  formValue.createdDate = formValue.createdDate; 


  this._noteService.addNoteFromServer(formValue).subscribe({
    next: (newNote) => {
      this.currentFridge.notes.push(newNote);
      this.addNoteForm.reset({
        text: '',
        fridgeId: this.currentFridge.id,
        createdDate: this.getTodayDateString(), // שומר את היום כברירת מחדל
        isResolved: false
      });
      this.noteAdded.emit(newNote);
    },
    error: (error) => {
      console.error("Error adding note:", error);
    }
  });
}




    
    
}
