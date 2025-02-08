import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Note} from '../note/note.model';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    basicUrl = 'https://localhost:7194/api/Notes';


    constructor(private _http: HttpClient) { }
    // getNotesFromServer(): Observable<Note[]> {
    //     console.log("getNotesFromServer");
        
    //     return this._http.get<Note[]>(this.basicUrl)
    // }
 
    addNoteFromServer(n: Note): Observable<any> {
        return this._http.post<any>(this.basicUrl, n);
      }

    //   save(s: Student) {
    //     var index = this.studentList.findIndex(stu => stu.id == s.id);
    //     this.studentList[index] = s
    //   }

    //   deleteStudent(index: number) {
    //     this.studentList.splice(index, 1);
    //   }

    //  
}
