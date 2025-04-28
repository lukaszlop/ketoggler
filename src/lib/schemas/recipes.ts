import { z } from "zod";

/**
 * Schema for validating macronutrients input in recipe creation/update
 */
const macronutrientsSchema = z.object({
  calories: z.number().min(0).max(10000),
  protein: z.number().min(0).max(1000),
  carbs: z.number().min(0).max(1000),
  fats: z.number().min(0).max(1000),
});

/**
 * Schema for validating recipe ingredients input
 */
const recipeIngredientSchema = z.object({
  ingredient_id: z.number().positive(),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(10),
});

/**
 * Schema for validating the complete recipe creation payload
 */
export const createRecipeSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  ingredients: z.array(recipeIngredientSchema).min(1).max(100),
  macronutrients: macronutrientsSchema,
  allergens: z.array(z.string().min(1).max(50)).max(50),
});
