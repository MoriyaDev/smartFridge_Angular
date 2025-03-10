import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';


import { FridgeService } from '../service/fridge.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService   {

  private isBrowser: boolean;
  private currentFridge: any = null;


  private apiUrl = 'https://localhost:7194/api/Auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();


  constructor(
    private _httpClient: HttpClient,
    private _fridgeService: FridgeService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkAndUpdateAuthStatus();
  }

  private checkAndUpdateAuthStatus(): void {
    if (this.isBrowser) {
      const session = localStorage.getItem('appSession');
      if (session) {
        const parsed = JSON.parse(session);
        if (this.isTokenValid(parsed.token)) {
          this.isLoggedInSubject.next(true);
          return;
        } else {
          localStorage.removeItem('appSession');
        }
      }
      this.isLoggedInSubject.next(false);
    }
  }

  private isTokenValid(token: string): boolean {
    if (!token) return false;
    
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; 
      return Date.now() < expirationTime;
    } catch (e) {
      console.error('שגיאה בניתוח הטוקן:', e);
      return false;
    }
  }

  getRole(): string {
    const session = localStorage.getItem('appSession');
    if (!session) return '';

    const parsedSession = JSON.parse(session);
    if (!parsedSession.token) return '';

    try {
      const tokenData = JSON.parse(atob(parsedSession.token.split('.')[1]));
      return tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
    } catch (e) {
      console.error('שגיאה בקריאת התפקיד מהטוקן:', e);
      return '';
    }
  }
  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  getUserSession() {
    const sessionData = localStorage.getItem('appSession');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    return null;
  }

  login(credentials: any): Observable<{ token: string; fridgeId: number }> {
    return this._httpClient.post<{ token: string; fridgeId: number }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token && res.fridgeId) {
          if (this.isBrowser) {
            localStorage.setItem('appSession', JSON.stringify({ user: res.fridgeId, token: res.token }));
          }
          this.isLoggedInSubject.next(true);
          this.loadFridge(res.fridgeId);
        }
      })
    );
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
}
