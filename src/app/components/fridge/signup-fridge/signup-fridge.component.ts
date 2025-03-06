import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FridgeService } from '../../../service/fridge.service';
import { Router } from '@angular/router';
import { debounceTime, switchMap, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-signup-fridge',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-fridge.component.html',
  styleUrl: './signup-fridge.component.css'
})
export class SignupFridgeComponent {
  public signupForm!: FormGroup;
  nameExists: boolean = false; // משתנה לבדוק אם השם כבר קיים
  existingNames: string[] = []; // מערך לשמות שכבר קיימים

  constructor(private _fridgeService: FridgeService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    // משיכת רשימת כל המקררים והוצאת השמות
    this._fridgeService.getFridgesFromServer().subscribe(fridges => {
      this.existingNames = fridges.map((fridge: any) => fridge.name); // שולף את כל השמות למערך
    });

    // בדיקה אם השם קיים בזמן אמת
    this.signupForm.controls['name'].valueChanges.pipe(
      debounceTime(500),
      map(name => {
        this.nameExists = this.existingNames.includes(name); // בדיקה אם השם כבר קיים
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  signup() {
    if (this.signupForm.invalid || this.nameExists) return; // מניעת שליחה אם יש שגיאה

    this._fridgeService.signupFromServer(this.signupForm.value).subscribe(
      () => this.router.navigate(['/fridge/login'])
    );
  }
}
