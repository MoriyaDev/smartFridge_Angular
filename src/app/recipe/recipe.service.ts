import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Recipe} from '../recipe/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {

    baseUrl = 'https://localhost:7194/api/Recipes';


    constructor(private _http: HttpClient) { }
    getRecipeByProductsFromServer(products: string): Observable<Recipe[]> {
        const url = `${this.baseUrl}/findByIngredients?ingredients=${encodeURIComponent(products)}&number=3`;
        return this._http.get<Recipe[]>(url);
    }
    
 
    

}
