import { catchError, Observable, of, tap } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://localhost:7194/api/Categorys'; 

  constructor(private _http: HttpClient) {}

  getCategoryName(categoryId: number): Observable<string> {
    const url = `${this.apiUrl}/${categoryId}`;
    
    return this._http.get(url, { responseType: 'text' }).pipe(  
      catchError(error => {
        return of("קטגוריה לא ידועה");
      })
    );
  }

  getCategoriesFromServer(): Observable<{ id: number, name: string }[]> {
    return this._http.get<{ id: number, name: string }[]>(`${this.apiUrl}`);
  }
  
}
