// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Fridge } from './fridge/fridge.model';
// import { HttpClient } from '@angular/common/http';
// import { FridgeService } from './fridge/fridge.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//     constructor(private _httpClient: HttpClient,
//       private _fridgeService : FridgeService
//     ) { }
//    isAuthenticated$ = new BehaviorSubject<boolean>(!!localStorage.getItem('appSession'));

//   get isAuthenticated(): boolean {
//     return this.isAuthenticated$.getValue();
//   }

// //   login(): void {
// //     localStorage.setItem('appSession', JSON.stringify({ user: 'some-user-id', token: 'abc' }));
// //     this.isAuthenticated$.next(true);
// //   }

// login(fridge: Fridge): void {
//   this._httpClient.post<{ token: string; fridgeId: number }>('https://localhost:7194/api/Auth', fridge)
//     .subscribe({
//       next: (res) => {
//         localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token })); // לוודא אותיות קטנות!
//         this.isAuthenticated$.next(true);
//         this._fridgeService.getFridgeByIdFromServer( res.fridgeId);

//       },
//       error: (err) => {
//         alert('שגיאה בהתחברות: ' + err.error);
//       }
//     });
// }


//   logout(): void {
//     localStorage.removeItem('appSession');
//     this.isAuthenticated$.next(false);
//   }

// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FridgeService } from './fridge/fridge.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7194/api/Auth'; // כתובת ה-API שלך
  isAuthenticated$ = new BehaviorSubject<boolean>(!!localStorage.getItem('appSession'));

  constructor(private _httpClient: HttpClient, private _fridgeService: FridgeService) {}

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  login(credentials: any): void {
    this._httpClient.post<{ token: string; fridgeId: number }>(this.apiUrl, credentials).subscribe({
      next: (res) => {
        if (res.token && res.fridgeId) {
          // שמירת המשתמש וה-Token
          localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token }));
          this.isAuthenticated$.next(true);

          // טעינת נתוני המקרר ושמירתם ב-Local Storage
          this.loadFridge(res.fridgeId);
        }
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + err.error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('appSession');
    localStorage.removeItem('selectedFridge');
    this.isAuthenticated$.next(false);
  }

  loadFridge(fridgeId: number) {
    this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
      next: (fridgeData: any) => {
        console.log("Fridge data loaded:", fridgeData);

        if (fridgeData) {
          localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
          this._fridgeService.setFridge(fridgeData);
          // this.fridgeData$.next(fridgeData);

        } else {
          console.error("No fridge data received from server");
        }
      },
      error: (error) => {
        console.error('Error retrieving fridge', error);
      }
    });
  }
}


