-- Migration: Disable All Policies
-- Description: Drops all previously defined RLS policies
-- Author: Database Migration System
-- Date: 2024-04-19

-- Drop user_profiles policies
drop policy if exists "Users can view their own profile" on user_profiles;
drop policy if exists "Users can update their own profile" on user_profiles;
drop policy if exists "Users can insert their own profile" on user_profiles;

-- Drop recipes policies
drop policy if exists "Anon users can view recipes" on recipes;
drop policy if exists "Auth users can view recipes" on recipes;
drop policy if exists "Users can create their own recipes" on recipes;
drop policy if exists "Users can update their own recipes" on recipes;
drop policy if exists "Users can delete their own recipes" on recipes;

-- Drop recipe_versions policies
drop policy if exists "Anon users can view recipe versions" on recipe_versions;
drop policy if exists "Auth users can view recipe versions" on recipe_versions;
drop policy if exists "Recipe owners can manage versions" on recipe_versions;

-- Drop macronutrients policies
drop policy if exists "Anon users can view macronutrients" on macronutrients;
drop policy if exists "Auth users can view macronutrients" on macronutrients;
drop policy if exists "Recipe owners can manage macronutrients" on macronutrients;

-- Drop ingredients policies
drop policy if exists "Anon users can view ingredients" on ingredients;
drop policy if exists "Auth users can view ingredients" on ingredients;
drop policy if exists "Authenticated users can add ingredients" on ingredients;

-- Drop recipe_ingredients policies
drop policy if exists "Anon users can view recipe ingredients" on recipe_ingredients;
drop policy if exists "Auth users can view recipe ingredients" on recipe_ingredients;
drop policy if exists "Recipe owners can manage ingredients" on recipe_ingredients;

-- Drop allergens policies
drop policy if exists "Anon users can view allergens" on allergens;
drop policy if exists "Auth users can view allergens" on allergens;
drop policy if exists "Authenticated users can add allergens" on allergens;

-- Drop recipe_allergens policies
drop policy if exists "Anon users can view recipe allergens" on recipe_allergens;
drop policy if exists "Auth users can view recipe allergens" on recipe_allergens;
drop policy if exists "Recipe owners can manage allergens" on recipe_allergens;

-- Drop user_allergens policies
drop policy if exists "Users can view their allergens" on user_allergens;
drop policy if exists "Users can manage their allergens" on user_allergens;

-- Drop favorites policies
drop policy if exists "Users can view their favorites" on favorites;
drop policy if exists "Users can manage their favorites" on favorites;

-- Drop audit_log policies
drop policy if exists "Users can view their audit logs" on audit_log;