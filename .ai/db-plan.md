# Schemat bazy danych PostgreSQL

## 1. Tabele

### 1.1. Tabela: users

This table is managed by Supabase Auth.

- **id**: BIGSERIAL PRIMARY KEY
- **username**: VARCHAR(255) NOT NULL UNIQUE
- **email**: VARCHAR(255) NOT NULL UNIQUE
- **encrypted_password**: VARCHAR(255) NOT NULL
- **created_at**: TIMESTAMP NOT NULL DEFAULT NOW()
- **confirmed_at**: TIMESTAMP

### 1.2. Tabela: user_profiles

- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
- **dietary_preferences**: TEXT
- **created_at**: TIMESTAMP NOT NULL DEFAULT NOW()

### 1.3. Tabela: recipes

- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **title**: VARCHAR(255) NOT NULL
- **description**: TEXT NOT NULL
- **created_at**: TIMESTAMP NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMP NOT NULL DEFAULT NOW()

### 1.4. Tabela: recipe_versions

- **version_id**: BIGSERIAL PRIMARY KEY
- **recipe_id**: INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
- **version_type**: RECIPE_VERSION_TYPE NOT NULL -- (ENUM: 'original', 'modified')
- **version_number**: INTEGER NOT NULL
- **changes**: JSONB -- Zawiera szczegóły zmian lub pełny migawkowy stan przepisu
- **recorded_at**: TIMESTAMP NOT NULL DEFAULT NOW()

_Uwaga: Typ wyliczeniowy RECIPE_VERSION_TYPE należy utworzyć przed użyciem, np.:_

```sql
CREATE TYPE recipe_version_type AS ENUM ('original', 'modified');
```

### 1.5. Tabela: macronutrients

- **recipe_id**: INTEGER PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE
- **calories**: INTEGER NOT NULL CHECK (calories >= 0)
- **protein**: NUMERIC(5,2) NOT NULL CHECK (protein >= 0)
- **carbs**: NUMERIC(5,2) NOT NULL CHECK (carbs >= 0)
- **fats**: NUMERIC(5,2) NOT NULL CHECK (fats >= 0)

### 1.6. Tabela: ingredients

- **id**: BIGSERIAL PRIMARY KEY
- **name**: VARCHAR(255) NOT NULL UNIQUE

### 1.7. Tabela: recipe_ingredients

- **recipe_id**: INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
- **ingredient_id**: INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE
- **quantity**: NUMERIC(10,2) NOT NULL CHECK (quantity >= 0)
- **unit**: VARCHAR(50)
- **PRIMARY KEY**: (recipe_id, ingredient_id)

### 1.8. Tabela: allergens

- **id**: BIGSERIAL PRIMARY KEY
- **name**: VARCHAR(255) NOT NULL UNIQUE

### 1.9. Tabela: recipe_allergens

- **recipe_id**: INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
- **allergen_id**: INTEGER NOT NULL REFERENCES allergens(id) ON DELETE CASCADE
- **PRIMARY KEY**: (recipe_id, allergen_id)

### 1.10. Tabela: user_allergens

- **user_profile_id**: INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE
- **allergen_id**: INTEGER NOT NULL REFERENCES allergens(id) ON DELETE CASCADE
- **PRIMARY KEY**: (user_profile_id, allergen_id)

### 1.11. Tabela: favorites

- **user_id**: INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **recipe_id**: INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE
- **favorited_at**: TIMESTAMP NOT NULL DEFAULT NOW()
- **PRIMARY KEY**: (user_id, recipe_id)

### 1.12. Tabela: audit_log

- **id**: BIGSERIAL PRIMARY KEY
- **table_name**: VARCHAR(255) NOT NULL
- **record_id**: BIGINT NOT NULL
- **operation**: VARCHAR(50) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
- **changed_at**: TIMESTAMP NOT NULL DEFAULT NOW()
- **changed_by**: INTEGER REFERENCES users(id)

## 2. Relacje między tabelami

- Każdy rekord w tabeli `users` ma powiązany rekord w tabeli `user_profiles` (relacja jeden-do-jednego).
- Każdy przepis (`recipes`) należy do jednego użytkownika (`users`) (relacja wiele-do-jednego).
- Przepis może mieć wiele wersji w tabeli `recipe_versions` (relacja jeden-do-wielu).
- Każdy przepis ma przypisany zestaw makroskładników w tabeli `macronutrients` (relacja jeden-do-jednego).
- Relacja między przepisami a składnikami jest obsługiwana przez tabelę łączącą `recipe_ingredients` (relacja wiele-do-wielu).
- Relacja między przepisami a alergenami jest obsługiwana przez tabelę łączącą `recipe_allergens` (relacja wiele-do-wielu).
- Relacja między profilami użytkowników a alergenami odbywa się poprzez tabelę `user_allergens` (relacja wiele-do-wielu).
- Relacja między użytkownikami a przepisami, które są oznaczone jako ulubione, jest obsługiwana przez tabelę `favorites` (relacja wiele-do-wielu).
- Tabela `audit_log` śledzi zmiany dokonywane w wybranych tabelach systemowych.

## 3. Indeksy

- Indeks na kolumnie `recipes.user_id` dla optymalizacji zapytań wyszukujących przepisy według właściciela.
- Klucz główny w tabelach łączących (`recipe_ingredients`, `recipe_allergens`, `user_allergens`, `favorites`) zapewnia indeksowanie relacji.
- Rozważenie dodatkowych indeksów na kolumnach `macronutrients.calories` oraz `macronutrients.carbs` dla optymalizacji zapytań opartych na wartościach kalorycznych i makroskładnikach.

## 4. Zasady PostgreSQL (RLS i inne)

- W tabelach `recipes`, `audit_log` oraz `favorites` wdrożyć polityki Row-Level Security (RLS), które pozwalają użytkownikowi na dostęp tylko do rekordów, gdzie `user_id` odpowiada identyfikatorowi użytkownika z Supabase Auth (np. auth.uid() = user_id).

  Przykładowa polityka:

  ```sql
  CREATE POLICY recipe_owner_policy ON recipes
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::INTEGER);
  ```

- W przyszłości, przy znacznym wzroście liczby rekordów, należy rozważyć partycjonowanie tabel oraz wykorzystanie materialized views do optymalizacji zapytań.

## 5. Dodatkowe uwagi

- Wszystkie klucze główne wykorzystują sekwencje (BIGSERIAL) do automatycznego generowania unikalnych identyfikatorów.
- Schemat zawiera restrykcyjne ograniczenia (NOT NULL, UNIQUE, CHECK) dla zapewnienia integralności danych, np. nieujemne wartości dla kalorii i makroskładników.
- Typ wyliczeniowy `recipe_version_type` służy do określenia rodzaju wersji przepisu ('original' lub 'modified').
- Schemat został zaprojektowany zgodnie z zasadami normalizacji (3NF), z możliwością rozważenia denormalizacji lub innych technik w celu optymalizacji wydajności przy dużej skali danych.
