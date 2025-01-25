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
    getNotesFormServer(): Observable<Note[]> {
        console.log("getNotesFormServer");
        
        return this._http.get<Note[]>(this.basicUrl)
    }
 
    addNoteFormServer(n: Note): Observable<any> {
        var note: Note = {
            id: 12345678,
            fridgeId: 1,
            text: "text1111",
            createdDate: "12-12-2015",
            isResolved: true
        };
        return this._http.post<any>(this.basicUrl, note);
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
