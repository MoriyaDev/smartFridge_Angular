
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {

  isLoggedIn: boolean = false;
  isMenuOpen = false;


  constructor(private _router: Router,
    private _authService: AuthService
  ) {}
  
  ngOnInit() {
    this._authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    }); }
  
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('appSession');
  }

  openMenu() {
    this.isMenuOpen = true;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  navigateTo(path: string) {
    this._router.navigate([path]);
  }

  logout() {
    this._authService.logout();
  }
  
  
  
}
