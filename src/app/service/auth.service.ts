

// import { Injectable, OnInit } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { FridgeService } from './fridge/fridge.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService implements OnInit {
//   private apiUrl = 'https://localhost:7194/api/Auth'; // כתובת ה-API שלך
//   isAuthenticated$ = new BehaviorSubject<boolean>(false); // ברירת מחדל: לא מחובר

//   constructor(private _httpClient: HttpClient, private _fridgeService: FridgeService) {}

//   ngOnInit() {
//     if (typeof window !== 'undefined' && localStorage.getItem('appSession')) {
//       this.isAuthenticated$.next(true);
//     }
//   }

//   get isAuthenticated(): boolean {
//     return this.isAuthenticated$.getValue();
//   }

//   login(credentials: any): void {
//     this._httpClient.post<{ token: string; fridgeId: number }>(this.apiUrl, credentials).subscribe({
//       next: (res) => {
//         if (res.token && res.fridgeId) {
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token }));
//           }
//           this.isAuthenticated$.next(true);
//           this.loadFridge(res.fridgeId);
//         }
//       },
//       error: (err) => {
//         alert('שגיאה בהתחברות: ' + err.error);
//       }
//     });
//   }

//   logout(): void {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('appSession');
//       localStorage.removeItem('selectedFridge');
//     }
//     this.isAuthenticated$.next(false);
//   }

//   loadFridge(fridgeId: number) {
//     this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
//       next: (fridgeData: any) => {
//         if (fridgeData && typeof window !== 'undefined') {
//           localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
//           this._fridgeService.setFridge(fridgeData);
//         }
//       },
//       error: (error) => {
//         console.error('Error retrieving fridge', error);
//       }
//     });
//   }
// }


import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FridgeService } from '../service/fridge.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private apiUrl = 'https://localhost:7194/api/Auth'; // כתובת ה-API שלך
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _httpClient: HttpClient,
    private _fridgeService: FridgeService,
    private _router: Router
  ) {}

  ngOnInit() {
    if (this.isBrowser() && localStorage.getItem('appSession')) {
      this.isAuthenticated$.next(true);
    }
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticated$.getValue();
  }

  login(credentials: any): void {
    this._httpClient.post<{ token: string; fridgeId: number }>(`${this.apiUrl}/login`, credentials).subscribe({
      next: (res) => {
        if (res.token && res.fridgeId) {
          if (this.isBrowser()) {
            localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token }));
          }
          this.isAuthenticated$.next(true);
          this.loadFridge(res.fridgeId);
        }
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + err.error);
      }
    });
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('appSession');
      localStorage.removeItem('selectedFridge');
    }
    this.isAuthenticated$.next(false);
    this._router.navigate(['/home']);
  }

  loadFridge(fridgeId: number) {
    this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
      next: (fridgeData: any) => {
        if (fridgeData && this.isBrowser()) {
          localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
          this._fridgeService.setFridge(fridgeData);
        }
      },
      error: (error) => {
        console.error('Error retrieving fridge', error);
      }
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
