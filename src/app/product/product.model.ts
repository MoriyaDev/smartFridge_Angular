export class Product {
    // מזהה ייחודי
    id!: number;
  
    // שם המוצר
    name!: string;
  
    // המקרר שהמוצר שייך אליו
    fridgeId!: number;
  
    // הקטגוריה של המוצר
    categoryID!: number;
  
    // כמות המוצר
    Amount!: number;
  
    // סוג היחידות
    Unit!: string;
  
    // תמונה של המוצר (URL לתמונה)
    ImageUrl!: string;
  
    // תאריך הקנייה
    purchaseDate!: Date;
  
    // תאריך תפוגה
    expiryDate!: Date;
  
    // מיקום המוצר (Fridge או Freezer)
    location!: string;
  }

  export enum UnitType {
    Kilogram = 'Kilogram',  // קילו
    Gram = 'Gram',          // גרמים
    Liter = 'Liter',        // ליטר
    Milliliter = 'Milliliter' // מיליליטר
  }
  