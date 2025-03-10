import { Component } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RecipeService } from '../../../service/recipe.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.css'
})

export class AddRecipeComponent {

  public addRecipeForm!: FormGroup;
  isAdmin: boolean = false;
  message: string = '';

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService) {}

ngOnInit(): void {
   this.addRecipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
    products: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
  });
  this.isAdmin = this.authService.isAdmin();
}
submitRecipe() {
  this.recipeService.addRecipeFromServer(this.addRecipeForm.value).subscribe({
    next: (response) => {
      this.message = response.message; 
      this.addRecipeForm.reset(); 
    },
    error: (err) => {
      this.message = '❌ שגיאה בהוספת המתכון: ' + err.error?.message || 'בעיה לא ידועה';
    }
  });
}


}