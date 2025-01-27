import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../fridge.service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-login-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './login-fridge.component.html',
  styleUrl: './login-fridge.component.css'
})
export class LoginFridgeComponent {
  public loginForm!: FormGroup;

  constructor(private _fridgeService : FridgeService, private router: Router){
    
}

ngOnInit(): void {
  this.loginForm=new FormGroup({
    'name': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required)
  })
  
}

login(){
  console.log(this.loginForm.value);
  this._fridgeService.loginFromServer(this.loginForm.value).subscribe(
    (response:any)=>{
      console.log(response);
      localStorage.setItem('fridgeId', response.fridgeId);
      this._fridgeService.setFridgeName(response.fridgeName);
      this.router.navigate(['/home'])    
    } ,
    error=>{
      console.error('Login failed', error);
     alert(error.error?.message || 'Login failed. Please try again.');
    } )
}

signup() {
  this.router.navigate(['/signup']);
}
}