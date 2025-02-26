import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../service/fridge.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-fridge.component.html',
  styleUrl: './signup-fridge.component.css'
})

export class SignupFridgeComponent {
  public signupForm!: FormGroup;

  constructor(private _fridgeService : FridgeService,private router: Router){

  }

  ngOnInit(): void {
    this.signupForm=new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    })
  }

  signup(){
    console.log(this.signupForm.value);
    this._fridgeService.signupFromServer(this.signupForm.value).subscribe(
      ()=> this.router.navigate(['/login'])
    )

}
}