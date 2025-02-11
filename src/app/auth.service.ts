import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Fridge } from './fridge/fridge.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private _httpClient: HttpClient) { }
   isAuthenticated$ = new BehaviorSubject<boolean>(!!localStorage.getItem('appSession'));

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

//   login(): void {
//     localStorage.setItem('appSession', JSON.stringify({ user: 'some-user-id', token: 'abc' }));
//     this.isAuthenticated$.next(true);
//   }

login(fridge: Fridge): void {
  this._httpClient.post<{ token: string; fridgeId: number }>('https://localhost:7194/api/Auth', fridge)
    .subscribe({
      next: (res) => {
        localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token })); // לוודא אותיות קטנות!
        this.isAuthenticated$.next(true);
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + err.error);
      }
    });
}


  logout(): void {
    localStorage.removeItem('appSession');
    this.isAuthenticated$.next(false);
  }

}

