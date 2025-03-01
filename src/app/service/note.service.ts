import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Note } from '../model/note.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    baseUrl = 'https://localhost:7194/api/Notes';

    constructor(private _http: HttpClient) { }
    addNoteFromServer(n: Note): Observable<any> {
        return this._http.post<any>(this.baseUrl, n);
    }

    getNotesByFridgeIdFromServer(fridgeId: number): Observable<Note[]> {
        return this._http.get<Note[]>(`${this.baseUrl}/byFridge/${fridgeId}`)
    }
    delNoteFromServer(noteId: number) {
        return this._http.delete(`${this.baseUrl}/${noteId}`); 
      }
      
}


