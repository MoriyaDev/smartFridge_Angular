import { debounceTime, map, catchError, of } from 'rxjs';

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FridgeService } from '../../../service/fridge.service';

@Component({
  selector: 'app-signup-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-fridge.component.html',
  styleUrl: './signup-fridge.component.css'
})

export class SignupFridgeComponent {

  public signupForm!: FormGroup;
  nameExists: boolean = false;
  existingNames: string[] = [];

  constructor(private _fridgeService: FridgeService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this._fridgeService.getFridgesFromServer().subscribe(fridges => {
      this.existingNames = fridges.map((fridge: any) => fridge.name);
    });

    this.signupForm.controls['name'].valueChanges.pipe(
      debounceTime(500),
      map(name => {
        this.nameExists = this.existingNames.includes(name);
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  signup() {
    if (this.signupForm.invalid || this.nameExists) return;
    this._fridgeService.signupFromServer(this.signupForm.value).subscribe(
      () => this.router.navigate(['/fridge/login'])
    );
  }

}
