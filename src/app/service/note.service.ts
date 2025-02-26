import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Note} from '../model/note.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    basicUrl = 'https://localhost:7194/api/Notes';

    constructor(private _http: HttpClient) { }
    addNoteFromServer(n: Note): Observable<any> {
        return this._http.post<any>(this.basicUrl, n);
      }

    
}
