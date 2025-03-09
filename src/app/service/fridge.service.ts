import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fridge } from '../model/fridge.model';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FridgeService {
  private isBrowser: boolean;
  private currentFridge: any = null;
  private basicUrl = 'https://localhost:7194/api/Fridges/';

  private fridge$ = new BehaviorSubject<any>(null);
  private fridgeProducts$ = new BehaviorSubject<Product[]>([]);

  constructor(
    private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {  // ✅ בדיקה אם הקוד רץ בצד הלקוח לפני גישה ל-localStorage
      const savedFridge = localStorage.getItem("selectedFridge");
      if (savedFridge) {
        const fridgeData = JSON.parse(savedFridge);
        this.fridge$.next(fridgeData);
        this.fridgeProducts$.next(fridgeData.products || []);
      }
    }
  }

  getFridgeByIdFromServer(id: number): Observable<any> {
    return this._http.get<any>(`${this.basicUrl}${id}`);
  }
  getFridgesFromServer(): Observable<Fridge[]> {
    return this._http.get<any>(`${this.basicUrl}`);
  }

  signupFromServer(fridge: Fridge): Observable<any> {
    return this._http.post<any>(this.basicUrl, fridge);
  }

  setFridge(fridge: any) {
    this.fridge$.next(fridge);
    this.fridgeProducts$.next(fridge.products || []);

    if (this.isBrowser) {  
      localStorage.setItem("selectedFridge", JSON.stringify(fridge));
    }
  }

  getFridgeObservable(): Observable<any> {
    return this.fridge$.asObservable();
  }

  getFridge(): any {
    return this.fridge$.getValue();
  }

  getFridgeProductsObservable(): Observable<Product[]> {
    return this.fridgeProducts$.asObservable();
  }

  updateProducts(products: Product[]) {
    let updatedFridge = this.fridge$.getValue();
    updatedFridge.products = products;
    this.setFridge(updatedFridge);
  }
}
