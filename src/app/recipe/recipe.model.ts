import internal from "stream";
import { Product } from "../product/product.model";

export class Recipe {
    id!: number;
    title!: string;
    image!: string;
    instructions!: string
    missedIngredientCount!: number
    usedIngredientCount!: number
    missedIngredients!: Product[] 
    usedIngredients!: Product[]
    isCritical !: boolean;
    score!: number;
  }
