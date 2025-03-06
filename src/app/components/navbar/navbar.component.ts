// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from '../service/auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterModule, CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {
//   isAuthenticated: boolean = false;
  
//   constructor(private _router: Router, 
//     // private _authService: AuthService
//   ) {

//   }
//   ngOnInit(): void {
//     // this._authService.isAuthenticated$.subscribe((_authStatus) => {
//     //   this.isAuthenticated = _authStatus;
//     // });
    
//   }  isMenuOpen = false;

//   openMenu() {
//     this.isMenuOpen = true;
//   }

//   closeMenu() {
//     this.isMenuOpen = false;
//   }

//   navigateTo(path: string) {
//     this._router.navigate([path]);
//   }

//   logout(){

//   }

// }










import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FridgeService } from '../../service/fridge.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // isAuthenticated=false
  isLoggedIn: boolean = false;
  isMenuOpen = false;


  constructor(private _router: Router,
    private _authService: AuthService
  ) {
    // this.authService.isAuthenticated$.subscribe(authStatus => {
    //   this.isAuthenticated = authStatus;
    // });
  }
  
  ngOnInit() {
    this._authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    }); }
  
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('appSession'); // אם יש טוקן, המשתמש מחובר
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
