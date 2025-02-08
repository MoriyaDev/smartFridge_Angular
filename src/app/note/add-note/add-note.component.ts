import { Component } from '@angular/core';
import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../fridge/fridge.service';


@Component({
  selector: 'app-add-note',
  imports: [ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css'
})
export class AddNoteComponent {
  public addNoteForm!: FormGroup;
  currentFridge: any = null;

  
    constructor(private _noteService: NoteService,
      private _fridgeService: FridgeService,

    ) {
    }

    
    ngOnInit(): void {
      this.currentFridge = this._fridgeService.getFridge();

      this.addNoteForm=new FormGroup({
       // 'id': new FormControl(0),
        'text': new FormControl('', [Validators.required, Validators.minLength(5)]),
        'fridgeId': new FormControl(this.currentFridge.id, Validators.required),
        'createdDate': new FormControl(new Date().toISOString()),
        'isResolved': new FormControl(false)
      
      }) 
    }

    addNote() {
      console.log(this.addNoteForm.value);
    
      this._noteService.addNoteFromServer(this.addNoteForm.value).subscribe({
        next: (data) => {
          // הוספת הפתק למערך הפתקים במקרר
          this.currentFridge.notes.push(data);
    
          // ניקוי הטופס לאחר הוספת הפתק בהצלחה
          this.addNoteForm.reset({
            text: '',
            fridgeId: this.currentFridge.id,
            createdDate: new Date().toISOString().split('T')[0],
            isResolved: false
          });
        },
        error: (error) => {
          console.error("Error adding note:", error);
        }
      });
    }
    
}
