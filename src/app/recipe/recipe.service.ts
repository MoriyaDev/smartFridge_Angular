import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Recipe} from '../recipe/recipe.model';
import { Product } from '../product/product.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {

    baseUrl = 'https://localhost:7194/api/Recipes';


    constructor(private _http: HttpClient) { }
    getRecipeByProductsFromServer(products: string): Observable<Recipe[]> {
        const url = `${this.baseUrl}/findByIngredients?ingredients=${encodeURIComponent(products)}&number=6`;
        return this._http.get<Recipe[]>(url);
    }

    getRecipesByExpirationFromServer(products: Product[]): Observable<Recipe[]> {
        return this._http.post<Recipe[]>(`${this.baseUrl}/ranked-recipes`, products);
    }
    
    
 
    

}
