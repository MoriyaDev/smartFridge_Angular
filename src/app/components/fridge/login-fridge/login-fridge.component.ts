
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../../service/fridge.service';
import {AuthService} from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './login-fridge.component.html',
  styleUrl: './login-fridge.component.css'
})
export class LoginFridgeComponent {
  public loginForm!: FormGroup;

  constructor(private _fridgeService : FridgeService, private router: Router,
    private _authService :AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  login(){
    const loginData = this.loginForm.value;
    this._authService.login(loginData);
    this.router.navigate(['/home']);


  }

  signup() {
    this.router.navigate(['/signup']);
  }

  getFridgeById(fridgeId: number) {
    this._fridgeService.getFridgeByIdFromServer(fridgeId).subscribe({
      next: (fridgeData: any) => {

        if (fridgeData) {
          localStorage.setItem('selectedFridge', JSON.stringify(fridgeData));
          this._fridgeService.setFridge(fridgeData);
          this.router.navigate(['/home']); // ✅ מעבירים לדף הבית רק אחרי שהמקרר נטען
        } else {
        }
      },
      error: (error) => {
        console.error('Error retrieving fridge', error);
      }
    });
  }
}

