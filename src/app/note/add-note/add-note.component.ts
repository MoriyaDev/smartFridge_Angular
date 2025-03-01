import { Component, EventEmitter, Output } from '@angular/core';
import { Note } from '../../model/note.model';
import { NoteService } from '../../service/note.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../service/fridge.service';


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
        text: new FormControl('', Validators.required),
        type: new FormControl('תזכורת', Validators.required),
        createdDate: new FormControl(new Date().toISOString()),
        fridgeId: new FormControl(this.currentFridge?.id || 0),
        isResolved: new FormControl(false)
      });
      
    }
    @Output() close = new EventEmitter<void>(); // הוספת אירוע לסגירת המודל

closeModal() {
  this.close.emit(); // שולח אירוע שהמודל נסגר
}


    addNote() {
      console.log(this.addNoteForm.value);
    
      this._noteService.addNoteFromServer(this.addNoteForm.value).subscribe({
        next: (newNote) => {
          this.currentFridge.notes.push(newNote); // הוספה למקרר
          this.addNoteForm.reset({
            text: '',
            fridgeId: this.currentFridge.id,
            createdDate: new Date().toISOString().split('T')[0],
            isResolved: false
          });
          this.noteAdded.emit(newNote); // 🔥 שולחים את הפתק החדש ל-NoteListComponent
        },
        error: (error) => {
          console.error("Error adding note:", error);
        }
      });
    }
    
    
}
