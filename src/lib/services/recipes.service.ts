import type { SupabaseClient } from "../../db/supabase.client";
import { DEFAULT_USER_ID } from "../../db/supabase.client";
import type { CreateRecipeCommand, IngredientDto, MacronutrientsDto, RecipeDto } from "../../types";

/**
 * Creates a new recipe in the database with all related data
 * Uses DEFAULT_USER_ID for development purposes
 */
export async function createRecipe(cmd: CreateRecipeCommand, supabase: SupabaseClient): Promise<RecipeDto> {
  // Start a Supabase transaction
  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({
      title: cmd.title,
      description: cmd.description,
      user_id: DEFAULT_USER_ID,
    })
    .select()
    .single();

  if (recipeError) {
    throw new Error(`Failed to create recipe: ${recipeError.message}`);
  }

  // Insert macronutrients
  const { error: macroError } = await supabase.from("macronutrients").insert({
    recipe_id: recipe.id,
    ...cmd.macronutrients,
  });

  if (macroError) {
    throw new Error(`Failed to create macronutrients: ${macroError.message}`);
  }

  // Insert recipe ingredients
  const recipeIngredients = cmd.ingredients.map((ing) => ({
    recipe_id: recipe.id,
    ingredient_id: ing.ingredient_id,
    quantity: ing.quantity,
    unit: ing.unit,
  }));

  const { error: ingredientsError } = await supabase.from("recipe_ingredients").insert(recipeIngredients);

  if (ingredientsError) {
    throw new Error(`Failed to create recipe ingredients: ${ingredientsError.message}`);
  }

  // Insert recipe allergens if any
  if (cmd.allergens.length > 0) {
    // First get allergen IDs
    const { data: allergenIds, error: allergenLookupError } = await supabase
      .from("allergens")
      .select("id")
      .in("name", cmd.allergens);

    if (allergenLookupError) {
      throw new Error(`Failed to lookup allergens: ${allergenLookupError.message}`);
    }

    const allergenLinks = allergenIds.map(({ id }) => ({
      recipe_id: recipe.id,
      allergen_id: id,
    }));

    const { error: allergensError } = await supabase.from("recipe_allergens").insert(allergenLinks);

    if (allergensError) {
      throw new Error(`Failed to create recipe allergens: ${allergensError.message}`);
    }
  }

  // Create initial version
  const { error: versionError } = await supabase.from("recipe_versions").insert({
    recipe_id: recipe.id,
    version_type: "original",
    version_number: 1,
  });

  if (versionError) {
    throw new Error(`Failed to create recipe version: ${versionError.message}`);
  }

  // Return complete recipe data
  const { data: completeRecipe, error: fetchError } = await supabase
    .from("recipes")
    .select(
      `
      id,
      title,
      description,
      user_id,
      created_at,
      updated_at,
      macronutrients!inner (
        calories,
        protein,
        carbs,
        fats
      ),
      recipe_ingredients!inner (
        quantity,
        unit,
        ingredients!inner (
          id,
          name
        )
      ),
      recipe_allergens (
        allergens!inner (
          name
        )
      )
    `
    )
    .eq("id", recipe.id)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch complete recipe: ${fetchError.message}`);
  }

  if (!completeRecipe) {
    throw new Error("Recipe not found after creation");
  }

  // Transform the data to match RecipeDto structure
  const ingredients: IngredientDto[] = completeRecipe.recipe_ingredients.map((ri) => ({
    id: ri.ingredients.id,
    name: ri.ingredients.name,
    quantity: ri.quantity,
    unit: ri.unit || "", // Ensure unit is never null
  }));

  const macronutrients: MacronutrientsDto = {
    calories: completeRecipe.macronutrients.calories,
    protein: completeRecipe.macronutrients.protein,
    carbs: completeRecipe.macronutrients.carbs,
    fats: completeRecipe.macronutrients.fats,
  };

  return {
    id: completeRecipe.id,
    title: completeRecipe.title,
    description: completeRecipe.description,
    user_id: parseInt(completeRecipe.user_id),
    ingredients,
    macronutrients,
    allergens: completeRecipe.recipe_allergens.map((ra) => ra.allergens.name),
    created_at: completeRecipe.created_at,
    updated_at: completeRecipe.updated_at,
  };
}
