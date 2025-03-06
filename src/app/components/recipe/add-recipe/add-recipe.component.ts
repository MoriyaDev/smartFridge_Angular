import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    private authService: AuthService
  ) {
   

}

ngOnInit(): void {
   // יצירת טופס עם ולידציה
   this.addRecipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
    products: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
  });
  this.isAdmin = this.authService.isAdmin();
}
submitRecipe() {
  // if (!this.authService.isAuthenticated()) {
  //   console.error("❌ המשתמש לא מחובר, לא שולחים בקשה!");
  //   this.message = '❌ עליך להתחבר כדי להוסיף מתכון!';
  //   return;
  // }

  console.log("✅ שולחים מתכון לשרת:", this.addRecipeForm.value);

  this.recipeService.addRecipeFromServer(this.addRecipeForm.value).subscribe({
    next: (response) => {
      console.log("✅ תגובת שרת:", response);
      this.message = response.message; // קבלת ההודעה מהשרת
      this.addRecipeForm.reset(); // איפוס הטופס
    },
    error: (err) => {
      console.error("❌ שגיאה מהשרת:", err);
      this.message = '❌ שגיאה בהוספת המתכון: ' + err.error?.message || 'בעיה לא ידועה';
    }
  });
}


}