import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fridge } from '../model/fridge.model';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class FridgeService {
  private currentFridge: any = null;
  private basicUrl = 'https://localhost:7194/api/Fridges/'; // ✅ URL בסיסי

  // 🔹 BehaviorSubject שמחזיק את המקרר ומאפשר לכל קומפוננטה להאזין לו
  private fridge$ = new BehaviorSubject<any>(null);

  // 🔹 BehaviorSubject שמחזיק את רשימת המוצרים ומאפשר להאזין לשינויים
  private fridgeProducts$ = new BehaviorSubject<Product[]>([]);

  constructor(private _http: HttpClient) { 
    const savedFridge = localStorage.getItem("selectedFridge");
    if (savedFridge) {
      const fridgeData = JSON.parse(savedFridge);
      this.fridge$.next(fridgeData);
      this.fridgeProducts$.next(fridgeData.products || []); // ✅ טוען גם את המוצרים
    }
  }

  getFridgeByIdFromServer(id: number): Observable<any> {
    return this._http.get<any>(`${this.basicUrl}${id}`);
  }

  signupFromServer(fridge: Fridge): Observable<any> {
    return this._http.post<any>(this.basicUrl, fridge);
  }

  // ✅ עדכון המקרר כולו, כולל מוצרים ושידור לכל הקומפוננטות המאזינות
  setFridge(fridge: any) {
    this.fridge$.next(fridge);
    this.fridgeProducts$.next(fridge.products || []);
    localStorage.setItem("selectedFridge", JSON.stringify(fridge));
  }

  getFridgeObservable(): Observable<any> {
    return this.fridge$.asObservable();
  }

  getFridge(): any {
    return this.fridge$.getValue();
  }

  // ✅ החזרת Observable של המוצרים כך שקומפוננטות יכולות להאזין לו
  getFridgeProductsObservable(): Observable<Product[]> {
    return this.fridgeProducts$.asObservable();
  }

  // ✅ עדכון רשימת המוצרים ושידור לכל הקומפוננטות
  updateProducts(products: Product[]) {
    let updatedFridge = this.fridge$.getValue();
    updatedFridge.products = products;
    this.setFridge(updatedFridge); // ✅ עדכון ושידור
  }
}
