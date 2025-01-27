import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Fridge } from './fridge.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FridgeService {
    private fridgeName: string='Fridge';

    setFridgeName(name: string) {
        this.fridgeName = name;
      }
    
      getFridgeName(): string {
        return this.fridgeName;
      }
    basicUrl = 'https://localhost:7194/api/Fridges';

    constructor(private _http: HttpClient) { }

    signupFromServer(f:Fridge):Observable<any>{
        return this._http.post<any>(this.basicUrl, f)
    }

    loginFromServer(f:Fridge):Observable<any>{
        return this._http.post<any>(`${this.basicUrl}/login`, f);
    }

}