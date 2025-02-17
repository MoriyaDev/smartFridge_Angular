import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Product} from '../product/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    baseUrl = 'https://localhost:7194/api/Products';


    constructor(private _http: HttpClient) { }
    getProductsByFridgeIdFromServer(fridgeId: number): Observable<Product[]> {
        return this._http.get<Product[]>(`${this.baseUrl}/fridge/${fridgeId}`)
    }
 
    addProductFromServer(p: Product): Observable<any> {
        return this._http.post<any>(this.baseUrl, p);
      }
      getCategoriesFromServer(): Observable<{ id: number, name: string }[]> {
        return this._http.get<{ id: number, name: string }[]>('https://localhost:7194/api/Categorys');
      }

      deleteProductFromServer(productId: number) {
        console.log("📡 שולח בקשת DELETE לשרת עם ID:", productId);
        return this._http.delete(`${this.baseUrl}/${productId}`)
      }
  
      

}
