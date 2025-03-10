import {  Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../model/recipe.model';

@Injectable({
    providedIn: 'root'
})

export class RecipeService {

    baseUrl = 'https://localhost:7194/api/recipes';

    constructor(private _http: HttpClient) { }
    getRecipeByProductsApiFromServer(products: string): Observable<Recipe[]> {
        const url = `${this.baseUrl}/findByIngredients?ingredients=${encodeURIComponent(products)}&number=2`;
        return this._http.get<Recipe[]>(url);
    }

    getRecipeByProductsFromServer(products: string, fridgeID: number): Observable<Recipe[]> {
        const url = `${this.baseUrl}/bypro?ingredients=${encodeURIComponent(products)}&fridgeId=${fridgeID}`;
        return this._http.get<Recipe[]>(url);
    }

    addRecipeFromServer(recipe: Recipe): Observable<{ message: string }> {
        return this._http.post<{ message: string }>(`${this.baseUrl}/add`, recipe);
    }

}
