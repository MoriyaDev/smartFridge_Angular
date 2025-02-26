import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Recipe} from '../model/recipe.model';
import { Product } from '../model/product.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {

    baseUrl = 'https://localhost:7194/api/recipes';
    // https://localhost:7194/api/recipes/bypro?ingredients=%D7%97%D7%9C%D7%91

    // https://localhost:7194/api/recipes/findByIngredients?ingredients=%D7%97%D7%9C%D7%91&number=2


    constructor(private _http: HttpClient) { }
    getRecipeByProductsApiFromServer(products: string): Observable<Recipe[]> {
        const url = `${this.baseUrl}/findByIngredients?ingredients=${encodeURIComponent(products)}&number=2`;
        return this._http.get<Recipe[]>(url);
    }

    getRecipeByProductsFromServer(products: string): Observable<Recipe[]> {
        const url = `${this.baseUrl}/bypro?ingredients=${encodeURIComponent(products)}`;
        return this._http.get<Recipe[]>(url);
    }


    // getRecipesByExpirationFromServer(products: Product[]): Observable<Recipe[]> {
    //     return this._http.post<Recipe[]>(`${this.baseUrl}/recommend`, products,{
    //         headers: new HttpHeaders({ 'Content-Type': 'application/json' }) // וידוא שהתוכן נשלח בפורמט JSON

    //     });
    // }
    
    
 
    

}
