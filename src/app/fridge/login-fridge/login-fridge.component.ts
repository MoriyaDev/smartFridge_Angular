// import { Component } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { FridgeService } from '../fridge.service';
// import { Router } from '@angular/router';
// import { error } from 'console';

// @Component({
//   selector: 'app-login-fridge',
//   imports: [ReactiveFormsModule],
//   templateUrl: './login-fridge.component.html',
//   styleUrl: './login-fridge.component.css'
// })
// export class LoginFridgeComponent {
//   public loginForm!: FormGroup;

//   constructor(private _fridgeService : FridgeService, private router: Router){
    
// }

// ngOnInit(): void {
//   this.loginForm=new FormGroup({
//     'name': new FormControl('', Validators.required),
//     'password': new FormControl('', Validators.required)
//   })
  
// }

// login() {
//   this._fridgeService.loginFromServer(this.loginForm.value).subscribe({
//     next: (response: any) => {
//       console.log("Login successful:", response);

//       if (response?.fridgeId) {
//         localStorage.setItem('fridgeId', response.fridgeId.toString());
//         this.getFridgeById(response.fridgeId);

//       } else {
//         console.error("Login response does not contain fridgeId");
//       }

//       this.router.navigate(['/home']);
//     },
//     error: (error) => {
//       console.error('Login failed', error);
//       alert(error.error?.message || 'Login failed. Please try again.');
//     }
//   });
// }

// signup() {
//   this.router.navigate(['/signup']);
// }

// getFridgeById(fridgeId: number) {
//   this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
//     next: (fridgeData: any) => {
//       console.log("Fridge data loaded:", fridgeData);

//       if (fridgeData) {
//         localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
//         this._fridgeService.setFridge(fridgeData);
//       } else {
//         console.error("No fridge data received from server");
//       }
//     },
//     error: (error) => {
//       console.error('Error retrieving fridge', error);
//     }
//   });
// }


// }
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../fridge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './login-fridge.component.html',
  styleUrl: './login-fridge.component.css'
})
export class LoginFridgeComponent {
  public loginForm!: FormGroup;

  constructor(private _fridgeService : FridgeService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  login() {
    this._fridgeService.loginFromServer(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log("Login successful:", response);

        if (response?.fridgeId) {
          localStorage.setItem('fridgeId', response.fridgeId.toString());
          this.getFridgeById(response.fridgeId);
        } else {
          console.error("Login response does not contain fridgeId");
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        alert(error.error?.message || 'Login failed. Please try again.');
      }
    });
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  getFridgeById(fridgeId: number) {
    this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
      next: (fridgeData: any) => {
        console.log("Fridge data loaded:", fridgeData);

        if (fridgeData) {
          localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
          this._fridgeService.setFridge(fridgeData);
          this.router.navigate(['/home']); // ✅ מעבירים לדף הבית רק אחרי שהמקרר נטען
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

