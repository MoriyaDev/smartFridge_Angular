


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fridge } from './fridge.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FridgeService {
  private currentFridge: any = null;
  private basicUrl = 'https://localhost:7194/api/Fridges/'; // ✅ תיקון ה-URL (הוספת `/` בסוף)

  constructor(private _http: HttpClient) { 
    this.loadFridgeFromStorage(); // ✅ טוען את המקרר בעת יצירת השירות
  }

  private loadFridgeFromStorage(): void {
    const savedFridge = localStorage.getItem('selectedFridge');
    if (savedFridge) {
      this.currentFridge = JSON.parse(savedFridge);
    }
  }

  getFridgeByIdFromServer(id: number): Observable<any> {
    return this._http.get<any>(`${this.basicUrl}${id}`); // ✅ הוספת `/` לפני ה-ID
  }

  signupFromServer(fridge: Fridge): Observable<any> {
    return this._http.post<any>(this.basicUrl, fridge);
  }

  loginFromServer(fridge: Fridge): Observable<any> {
    return this._http.post<any>(`${this.basicUrl}login`, fridge);
  }

  // loginFromServer(loginData: ???): Observable<any> {
  //   return this._http.post<{token: string; id: number}>(`https://localhost:7194/api/Auth`, loginData);
  // }

  setFridge(fridgeData: any): void {
    if (fridgeData) { // ✅ בדיקה שהנתונים תקינים
      this.currentFridge = fridgeData;
      localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
    }
  }

  getFridge(): any {
    if (!this.currentFridge) {
      this.loadFridgeFromStorage(); // ✅ טוען מחדש אם השירות נטען מההתחלה
    }
    return this.currentFridge;
  }
}
