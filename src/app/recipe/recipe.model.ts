import internal from "stream";

export class Recipe {
    id!: number;
    title!: string;
    imageUrl!: string;
    instructions!: string
    missedIngredientCount!: number
    usedIngredientCount!: number
  }
