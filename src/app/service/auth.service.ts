import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FridgeService } from '../service/fridge.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  private isBrowser: boolean;
  private currentFridge: any = null;


  private apiUrl = 'https://localhost:7194/api/Auth';
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  constructor(
    private _httpClient: HttpClient,
    private _fridgeService: FridgeService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser && localStorage.getItem('appSession')) {
      this.isAuthenticated$.next(true);
    }
  }

  getRole(): string {
    const session = localStorage.getItem('appSession');
    if (!session) return '';

    const tokenData = JSON.parse(atob(JSON.parse(session).token.split('.')[1]));
    console.log("🔹 נתוני ה-JWT:", tokenData); // הדפסה לבדיקה

    return tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
}

isAdmin(): boolean {
    return this.getRole() === 'Admin';
}

  getUserSession() {
    const sessionData = localStorage.getItem('appSession');
    if (sessionData) {
      return JSON.parse(sessionData); // המרה חזרה לאובייקט JSON
    }
    return null;
  }
  
  private checkLoginStatus(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('appSession');
    }
    return false;
  }

  login(credentials: any): void {
    this._httpClient.post<{ token: string; fridgeId: number }>(`${this.apiUrl}/login`, credentials).subscribe({
      next: (res) => {
        if (res.token && res.fridgeId) {
          if (this.isBrowser) {
            localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token }));
          }
          this.isAuthenticated$.next(true);
          this.isLoggedInSubject.next(true);
          this.loadFridge(res.fridgeId); // ✅ טוען את המקרר מיד אחרי התחברות
        }
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + err.error);
      }
    });
  }
  

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('appSession');
    }
    this.isLoggedInSubject.next(false);
    this._router.navigate(['/home']);
  }

  loadFridge(fridgeId: number) {
    this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
      next: (fridgeData: any) => {
        if (fridgeData && this.isBrowser) {
          localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
          this._fridgeService.setFridge(fridgeData);
        }
      },
      error: (error) => {
        console.error('Error retrieving fridge', error);
      }
    });
  }

  // private isBrowserF(): boolean {
  //   return typeof window !== 'undefined';
  // }
}
