import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../../service/fridge.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './login-fridge.component.html',
  styleUrl: './login-fridge.component.css'
})
export class LoginFridgeComponent {
  public loginForm!: FormGroup;
  existingNames: string[] = []; 
  nameNotFound: boolean = false; 
  wrongPassword: boolean = false;

  constructor(private _fridgeService: FridgeService, private router: Router,
    private _authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });

    this._fridgeService.getFridgesFromServer().subscribe(fridges => {
      this.existingNames = fridges.map((fridge: any) => fridge.name);
    });
  }

  login() {
    const loginData = this.loginForm.value;
    const username = loginData.name;
    const password = loginData.password;

    if (!this.existingNames.includes(username)) {
      this.nameNotFound = true;
      this.wrongPassword = false; 
      return;
    }

    this._authService.login(loginData).subscribe({
      next: (response) => {
        if (response.token) {
          this.router.navigate(['/home']);
        } else {
          this.wrongPassword = true;
          this.nameNotFound = false;
        }
      },
      error: () => {
        this.wrongPassword = true;
        this.nameNotFound = false;
      }
    });
    
  }

  signup() {
    this.router.navigate(['/fridge/signup']);
  }
}
