import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NoteService } from '../../../service/note.service';
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
    private _fridgeService: FridgeService,) { }

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
    let offset = today.getTimezoneOffset() * 60000; 
    let localISOTime = new Date(today.getTime() - offset).toISOString().split('T')[0];

    return localISOTime;
  }



  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit(); 
  }

  addNote() {
    let formValue = { ...this.addNoteForm.value };
    formValue.createdDate = formValue.createdDate;
    this._noteService.addNoteFromServer(formValue).subscribe({
      next: (newNote) => {
        this.currentFridge.notes.push(newNote);
        this.addNoteForm.reset({
          text: '',
          fridgeId: this.currentFridge.id,
          createdDate: this.getTodayDateString(), 
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
