/**
 * DTO and Command Model Definitions for the API
 *
 * These types are derived from the database models (e.g. from database.types.ts) and
 * are tailored to match the API plan described in .ai/api-plan.md. The DTOs and Command Models
 * ensure type safety and a clear contract between the client and server.
 */

import type { Json } from "./db/database.types";

// ------------------------
// User Profile DTOs
// ------------------------

/**
 * Represents the user profile data returned by GET /profile.
 * Derived from the 'user_profiles' table combined with allergen information from 'user_allergens'.
 * Note: The original user_id in the database is a string but is converted to a number for the API response.
 */
export interface UserProfileDto {
  user_id: number; // Converted from user_profiles.user_id
  dietary_preferences: string; // From user_profiles.dietary_preferences (assumed non-null for API)
  allergens: string[]; // From associated user_allergens/allergens names
  created_at: string; // ISO timestamp
}

/**
 * Command for updating the user profile via PUT /profile.
 */
export interface UpdateUserProfileCommand {
  dietary_preferences: string;
  allergens: string[];
}

// ------------------------
// Recipe Related DTOs and Commands
// ------------------------

/**
 * Represents an ingredient within a recipe.
 * Combines data from the 'ingredients' and 'recipe_ingredients' tables.
 */
export interface IngredientDto {
  id: number; // From ingredients.id
  name: string; // From ingredients.name
  quantity: number; // From recipe_ingredients.quantity
  unit: string; // From recipe_ingredients.unit
}

/**
 * Represents the macronutrient details for a recipe.
 * Derived from the 'macronutrients' table.
 */
export interface MacronutrientsDto {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/**
 * Main DTO for a recipe returned by GET /recipes/{id}.
 * Combines data from 'recipes', joined with 'recipe_ingredients', 'ingredients', 'macronutrients', and 'recipe_allergens'.
 */
export interface RecipeDto {
  id: number;
  title: string;
  description: string;
  user_id: number; // Converted from recipes.user_id
  ingredients: IngredientDto[];
  macronutrients: MacronutrientsDto;
  allergens: string[]; // List of allergen names
  created_at: string;
  updated_at: string;
}

/**
 * Response DTO for listing recipes with pagination (GET /recipes).
 */
export interface PagedRecipesResponse {
  data: RecipeDto[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

// ------------
// Recipe Commands
// ------------

/**
 * Input type for each ingredient when creating/updating a recipe.
 * Derived from 'recipe_ingredients' table requirements.
 */
export interface RecipeIngredientInput {
  ingredient_id: number;
  quantity: number;
  unit: string;
}

/**
 * Command input for macronutrient details when creating/updating a recipe.
 * Derived from the 'macronutrients' table structure.
 */
export interface MacronutrientsCommand {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/**
 * Command for creating a new recipe via POST /recipes.
 * This command links the recipe to the authenticated user and includes all necessary details.
 */
export interface CreateRecipeCommand {
  title: string;
  description: string;
  ingredients: RecipeIngredientInput[];
  macronutrients: MacronutrientsCommand;
  allergens: string[];
}

/**
 * Command for updating an existing recipe via PUT /recipes/{id}.
 * Uses the same structure as CreateRecipeCommand.
 */
export type UpdateRecipeCommand = CreateRecipeCommand;

// ------------------------
// Recipe Modification (AI Integration)
// ------------------------

/**
 * Command for submitting a recipe for AI modification via POST /recipes/{id}/modify.
 */
export interface RecipeModificationCommand {
  preferences: {
    desired_calories: number;
    avoid_allergens: string[];
  };
  additional_instructions: string;
}

/**
 * Response DTO for the AI modification endpoint (/recipes/{id}/modify).
 * Contains the proposed changes and the suggested version type.
 */
export interface RecipeModificationResponse {
  proposed_changes: {
    ingredients: IngredientDto[];
    macronutrients: MacronutrientsDto;
  };
  suggested_version: "modified";
}

// ------------------------
// Recipe Versions
// ------------------------

/**
 * DTO representing a single version of a recipe (from recipe_versions table).
 */
export type VersionType = "original" | "modified";

export interface RecipeVersionDto {
  version_id: number;
  version_type: VersionType;
  version_number: number;
  changes: Json | null; // Object representing changes, typed as Json from the database models
  recorded_at: string;
}

/**
 * Response DTO for retrieving version history via GET /recipes/{id}/versions.
 */
export interface RecipeVersionsResponse {
  versions: RecipeVersionDto[];
}

// ------------------------
// Favorites
// ------------------------

/**
 * DTO representing a favorite recipe in the user's favorites list.
 */
export interface FavoriteDto {
  recipe_id: number;
  title: string;
  favorited_at: string;
}

/**
 * Response DTO for GET /users/me/favorites.
 */
export interface FavoritesResponse {
  favorites: FavoriteDto[];
}

/**
 * Command for adding a recipe to favorites via POST /users/me/favorites.
 */
export interface AddFavoriteCommand {
  recipe_id: number;
}
