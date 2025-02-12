import internal from "stream";

export class Recipe {
    id!: number;
    title!: string;
    image!: string;
    instructions!: string
    missedIngredientCount!: number
    usedIngredientCount!: number
    isCritical !: boolean;
    score!: number;
  }
