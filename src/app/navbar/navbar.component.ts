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
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAuthenticated=false

  constructor(private _router: Router,
    // private 
    //  authService: AuthService
  ) {
    // this.authService.isAuthenticated$.subscribe(authStatus => {
    //   this.isAuthenticated = authStatus;
    // });
  }
  isMenuOpen = false;
  


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
    // this.authService.logout();
    // this._router.navigate(['/home']); // להפנות לדף הבית לאחר יציאה
  }

}
