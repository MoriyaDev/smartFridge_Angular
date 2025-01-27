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
    quantity!: number;
  
    // סוג היחידות
    unitType!: UnitType;
  
    // תמונה של המוצר (URL לתמונה)
    image!: string;
  
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
  