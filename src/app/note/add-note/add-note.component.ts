import { Component } from '@angular/core';
import { Note } from '../note.model';
import { NoteService } from '../note.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-note',
  imports: [ReactiveFormsModule],
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css'
})
export class AddNoteComponent {
  public addNoteForm!: FormGroup;
  
    constructor(private _noteService: NoteService) {
    }

    
    ngOnInit(): void {
      this.addNoteForm=new FormGroup({
       // 'id': new FormControl(0),
        'text': new FormControl('', [Validators.required, Validators.minLength(5)]),
        'fridgeId': new FormControl(0 , [Validators.required]),
        'createdDate': new FormControl(new Date().toISOString()),
        'isResolved': new FormControl(false)
      
      }) 
    }

  addNote(){
    console.log(this.addNoteForm.value);

    this._noteService.addNoteFormServer(this.addNoteForm.value).subscribe({})
  }

}
