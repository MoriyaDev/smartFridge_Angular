export class Note {
    id!: number; // מזהה ייחודי של הפתק
    fridgeId!: number; // מזהה המקרר שאליו שייך הפתק
    text!: string; // טקסט התזכורת
    createdDate!: string; // תאריך יצירת הפתק
    isResolved!: boolean; // אינדיקציה אם הפתק טופל
  }
  