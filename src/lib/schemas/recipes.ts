import { z } from "zod";

/**
 * Schema for validating query parameters in GET /recipes endpoint
 */
export const GetRecipesQuerySchema = z
  .object({
    kcal: z.coerce.number().positive().optional(),
    max_carbs: z.coerce.number().min(0).optional(),
    allergens: z
      .string()
      .transform((str) => str.split(","))
      .optional(),
    random: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    page_size: z.coerce.number().int().positive().optional().default(10),
  })
  .strict();

export type GetRecipesQueryParams = z.infer<typeof GetRecipesQuerySchema>;

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
