import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://localhost:7194/api/Categorys'; // עדכן לפי הכתובת שלך

  constructor(private _http: HttpClient) {}

  getCategoryName(categoryId: number): Observable<string> {
    const url = `${this.apiUrl}/${categoryId}`;
    
    return this._http.get(url, { responseType: 'text' }).pipe(  // ✅ לוודא שהתגובה מתקבלת כטקסט
      tap(response => console.log(`✅ תשובת השרת עבור קטגוריה ${categoryId}:`, response)),
      catchError(error => {
        return of("קטגוריה לא ידועה");
      })
    );
  }

  getCategoriesFromServer(): Observable<{ id: number, name: string }[]> {
    return this._http.get<{ id: number, name: string }[]>(`${this.apiUrl}`);
  }
  
  
}


//   getCategoryName(categoryId: number): Observable<string> {
//     return this.http.get<string>(`${this.apiUrl}/${categoryId}`);
//   }
// }
