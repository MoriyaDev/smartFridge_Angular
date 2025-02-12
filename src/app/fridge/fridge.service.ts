


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fridge } from './fridge.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FridgeService {
  private currentFridge: any = null;
  private basicUrl = 'https://localhost:7194/api/Fridges/'; // ✅ תיקון ה-URL (הוספת `/` בסוף)
  private fridge$ = new BehaviorSubject<any>(null); 

  constructor(private _http: HttpClient) { 
    // this.loadFridgeFromStorage(); 
    // ✅ טוען את המקרר בעת יצירת השירות
    const savedFridge = localStorage.getItem("selectedFridge");
    if (savedFridge) {
      this.fridge$.next(JSON.parse(savedFridge)); // 👈 טוען את המקרר מהלוקל סטורג'
    } 
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

  setFridge(fridge: any) {
    this.fridge$.next(fridge);
  }
  
  getFridgeObservable(): Observable<any> {
    return this.fridge$.asObservable();
  }
  getFridge(): any {
    return this.fridge$.getValue(); // 👈 מחזיר את המקרר השמור
  } 
  // loginFromServer(fridge: Fridge): Observable<any> {
  //   return this._http.post<any>(`${this.basicUrl}login`, fridge);
  // }

  // loginFromServer(loginData: ???): Observable<any> {
  //   return this._http.post<{token: string; id: number}>(`https://localhost:7194/api/Auth`, loginData);
  // }

  // setFridge(fridgeData: any): void {
  //   if (fridgeData) { // ✅ בדיקה שהנתונים תקינים
  //     this.currentFridge = fridgeData;
  //     localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
  //   }
  // }

  // getFridge(): any {
  //   if (!this.currentFridge) {
  //     this.loadFridgeFromStorage(); // ✅ טוען מחדש אם השירות נטען מההתחלה
  //   }
  //   return this.currentFridge;
  // }


}
