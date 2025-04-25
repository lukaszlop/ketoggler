# REST API Plan

## 1. Resources

- **Users** (maps to the `users` table): Contains user credentials and basic account information.
- **User Profiles** (maps to the `user_profiles` table): Contains additional user details like dietary preferences and allergens.
- **Recipes** (maps to the `recipes` table): Represents recipes submitted by users, including title, description, and owner reference.
- **Recipe Versions** (maps to the `recipe_versions` table): Stores different versions of a recipe (original and modified by AI).
- **Macronutrients** (maps to the `macronutrients` table): Provides nutritional details (calories, protein, carbs, fats) for each recipe.
- **Ingredients** (maps to the `ingredients` table) and **Recipe Ingredients** (maps to the `recipe_ingredients` table): Define available ingredients and their association (with quantity and unit) to recipes.
- **Allergens** (maps to the `allergens` table) and **Recipe Allergens** (maps to the `recipe_allergens` table): Define potential allergens in recipes.
- **User Allergens** (maps to the `user_allergens` table): Associates user profiles with allergens.
- **Favorites** (maps to the `favorites` table): Links users with their favorite recipes.
- **Audit Log** (maps to the `audit_log` table): Used internally to track operations but not exposed directly via the API.

## 2. Endpoints

### User Profile

- **GET /profile**

  - **Description:** Retrieve the authenticated user's profile information.
  - **Response (200 OK):**
    ```json
    {
      "user_id": "number",
      "dietary_preferences": "string",
      "allergens": ["string"],
      "created_at": "ISO timestamp"
    }
    ```

- **PUT /profile**
  - **Description:** Update the authenticated user's profile.
  - **Request JSON:**
    ```json
    {
      "dietary_preferences": "string",
      "allergens": ["string"]
    }
    ```
  - **Response:** 200 OK with updated profile details.

### Recipes

- **GET /recipes**

  - **Description:** Retrieve a list of recipes with optional filtering, sorting, and pagination.
  - **Query Parameters:**
    - `kcal` (number): Filter by calorie value.
    - `max_carbs` (number): Max allowed carbohydrates.
    - `allergens` (comma-separated strings): Exclude or include recipes with specific allergens.
    - `random` (boolean): If true, return a random recipe matching filters.
    - `page` and `page_size` for pagination.
  - **Response (200 OK):**
    ```json
    {
      "data": [ { recipe_object } ],
      "pagination": { "page": 1, "page_size": 10, "total": 100 }
    }
    ```

- **GET /recipes/{id}**

  - **Description:** Retrieve detailed information about a specific recipe, including ingredients, macronutrients, and allergens.
  - **Response (200 OK):**
    ```json
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "user_id": "number",
      "ingredients": [{ "id": "number", "name": "string", "quantity": "number", "unit": "string" }],
      "macronutrients": { "calories": "number", "protein": "number", "carbs": "number", "fats": "number" },
      "allergens": ["string"],
      "created_at": "ISO timestamp",
      "updated_at": "ISO timestamp"
    }
    ```

- **POST /recipes**

  - **Description:** Create a new recipe. The recipe is automatically linked to the authenticated user.
  - **Request JSON:**
    ```json
    {
      "title": "string",
      "description": "string",
      "ingredients": [{ "ingredient_id": "number", "quantity": "number", "unit": "string" }],
      "macronutrients": { "calories": "number", "protein": "number", "carbs": "number", "fats": "number" },
      "allergens": ["string"]
    }
    ```
  - **Response (201 Created):** Returns the created recipe object.

- **PUT /recipes/{id}**

  - **Description:** Update an existing recipe. The endpoint validates that the authenticated user is the owner.
  - **Request JSON:** Similar to recipe creation payload.
  - **Response:** 200 OK with the updated recipe.

- **DELETE /recipes/{id}**
  - **Description:** Delete a recipe. Only the owner can delete their recipe.
  - **Response:** 200 OK on successful deletion.

### Recipe Versions & AI Modifications

- **GET /recipes/{id}/versions**

  - **Description:** Retrieve the version history of a recipe.
  - **Response (200 OK):**
    ```json
    {
      "versions": [
        {
          "version_id": "number",
          "version_type": "string",
          "version_number": "number",
          "changes": "object",
          "recorded_at": "ISO timestamp"
        }
      ]
    }
    ```

- **POST /recipes/{id}/modify**
  - **Description:** Submit a recipe for AI analysis to generate modifications based on ketogenic requirements. The endpoint calls external AI services (e.g., via Openrouter.ai) and returns proposed changes.
  - **Request JSON:**
    ```json
    {
      "preferences": { "desired_calories": "number", "avoid_allergens": ["string"] },
      "additional_instructions": "string"
    }
    ```
  - **Response (200 OK):**
    ```json
    { "proposed_changes": { "ingredients": [...], "macronutrients": {...} }, "suggested_version": "modified" }
    ```

### Favorites

- **GET /users/me/favorites**

  - **Description:** Retrieve the authenticated user's list of favorite recipes.
  - **Response (200 OK):**
    ```json
    { "favorites": [{ "recipe_id": "number", "title": "string", "favorited_at": "ISO timestamp" }] }
    ```

- **POST /users/me/favorites**

  - **Description:** Add a recipe to the authenticated user's favorites.
  - **Request JSON:**
    ```json
    { "recipe_id": "number" }
    ```
  - **Response:** 201 Created with confirmation.

- **DELETE /users/me/favorites/{recipe_id}**
  - **Description:** Remove a recipe from the favorites list.
  - **Response:** 200 OK upon successful removal.

## 3. Authentication and Authorization

- **Mechanism:** Utilize JWT tokens or Supabase session tokens for authentication. All endpoints (except registration, login, and verification) require a valid token.
- **Authorization:** Enforce that users can only access or modify their own resources (e.g., a recipe's owner, user profile). Database-level Row-Level Security (RLS) policies further restrict access (as documented in the DB schema).
- **Security Measures:** All communications are secured via HTTPS, and passwords must be hashed. Rate limiting, secure headers, and encryption are used to protect against abuse.

## 4. Validation and Business Logic

- **Validation Rules:**

  - Numeric fields (e.g., calories, protein, carbs, fats) are validated to ensure they are non-negative.
  - Unique constraints on username and email during registration.
  - Relationship integrity is enforced (e.g., a recipe must reference valid ingredient IDs, and deletions cascade as per DB design).

- **Business Logic Mapping:**

  - **User Registration and Verification:** Registration endpoint sends a verification email. Verification is completed via the /auth/verify endpoint.
  - **Profile Completeness:** During login or when fetching /profile, the API can flag incomplete profiles (e.g., missing allergens) to trigger a UI pop-up reminder.
  - **Recipe Management:** Recipes are created/updated by the owner. Editing and deletion are only allowed for the authenticated owner.
  - **Favorites:** Users can add or remove recipes from their favorites. The favorites endpoints ensure that only the authenticated user can modify their list.
  - **AI Integration:** The /recipes/{id}/modify endpoint triggers AI processing to suggest modifications. Proposed changes are not finalized until confirmed by the user, and a new recipe version may be created.

- **Performance Considerations:**
  - Use of database indexes (e.g., on `recipes.user_id`, `macronutrients.calories`, and `macronutrients.carbs`) to optimize query performance.
  - Pagination and filtering on list endpoints to manage large datasets.
  - Rate limiting is applied to prevent abuse and ensure consistent performance.

---

This API plan leverages the provided database schema, fulfills the product requirements described in the PRD, and aligns with the technology stack (Astro with React on the frontend, Supabase posterior for backend/database operations, and integration with AI services via Openrouter.ai) to provide a comprehensive and performant REST API solution.
