# API Endpoint Implementation Plan: GET /recipes

## 1. Przegląd punktu końcowego

Endpoint GET /recipes służy do pobierania listy przepisów z możliwością filtrowania, sortowania oraz paginacji. Funkcjonalność ta umożliwia użytkownikom dostosowanie wyszukiwania przepisów do ich specyficznych potrzeb dietetycznych, jak np. filtrowanie po kaloriach, węglowodanach, alergenach lub losowy wybór przepisu.

## 2. Szczegóły żądania

- **Metoda HTTP:** GET
- **Struktura URL:** /recipes
- **Parametry zapytania:**
  - **Wymagane:** Brak (wszystkie parametry są opcjonalne).
  - **Opcjonalne:**
    - `kcal` (number): Filtracja przepisów według wartości kalorycznej.
    - `max_carbs` (number): Maksymalna dozwolona liczba węglowodanów.
    - `allergens` (string, comma-separated): Lista alergenów do włączenia lub wykluczenia.
    - `random` (boolean): Jeżeli ustawione na true, zwracany jest losowy przepis spełniający kryteria filtrowania.
    - `page` (number): Numer strony dla paginacji.
    - `page_size` (number): Liczba rekordów na jedną stronę.
- **Request Body:** Brak

## 3. Wykorzystywane typy

- **DTO:** `RecipeDto` – reprezentuje szczegółowe dane przepisu, takie jak identyfikator, tytuł, opis, składniki, makroskładniki, alergeny oraz daty utworzenia i modyfikacji.
- **Odpowiedź:** `PagedRecipesResponse` – zawiera listę obiektów `RecipeDto` oraz obiekt paginacji z polami: `page`, `page_size` i `total`.

## 4. Szczegóły odpowiedzi

- **Status 200 (OK):** Zwracany jest obiekt JSON o strukturze:
  ```json
  {
    "data": [ { recipe_object } ],
    "pagination": { "page": 1, "page_size": 10, "total": 100 }
  }
  ```
- **Kody błędów:**
  - 400 – Nieprawidłowe dane wejściowe (np. błędne typy parametrów).
  - 500 – Błąd wewnętrzny serwera lub problem z zapytaniem do bazy.

## 5. Przepływ danych

1. Odbiór żądania GET /recipes z opcjonalnymi parametrami.
2. Walidacja oraz parsowanie parametrów przy użyciu Zod, zapewniające zgodność z wymaganym schematem.
3. Przekazanie zapytań do warstwy serwisowej (np. `recipeService` w `src/lib/services`), która buduje odpowiednie zapytanie do bazy danych Supabase.
4. Wykonanie zapytania do bazy, uwzględniając:
   - Filtrowanie po kaloriach (`kcal`)
   - Filtrowanie po maksymalnej liczbie węglowodanów (`max_carbs`)
   - Filtrowanie lub wykluczanie przepisów zawierających określone alergeny (`allergens`)
   - Losowe wybieranie przepisu, jeśli `random` jest ustawiony
   - Paginację wyników (`page` i `page_size`)
5. Mapowanie pobranych danych na obiekty typu `RecipeDto`.
6. Budowa obiektu odpowiedzi `PagedRecipesResponse` zawierającego dane oraz szczegóły paginacji.
7. Zwrócenie odpowiedzi do klienta.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie i autoryzacja:** Endpoint powinien być dostępny tylko dla uprawnionych użytkowników, jeśli wymaga tego logika biznesowa.
- **Walidacja danych:** Wszystkie dane wejściowe są walidowane przy użyciu Zod, aby zapobiegać SQL Injection i zapewnić integralność danych.
- **Bezpieczeństwo bazy danych:** Użycie parametryzowanych zapytań do bazy danych Supabase, wraz z odpowiednimi indeksami, aby zwiększyć wydajność i bezpieczeństwo.
- **Rate Limiting:** Ewentualne wdrożenie ograniczeń liczby zapytań, aby chronić system przed nadużyciami.
- **Logowanie i monitorowanie:** Rejestrowanie błędów w dedykowanym systemie logowania lub tabeli `audit_log` w przypadku krytycznych błędów.

## 7. Obsługa błędów

- **Błędne dane wejściowe (400):** W przypadku wykrycia niewłaściwych typów lub zakresów parametrów, zwracany jest kod 400 z informacją o błędzie walidacji.
- **Błąd bazy danych (500):** Jeśli wystąpi problem podczas pobierania danych z bazy, zwracany jest kod 500, a szczegóły błędu są logowane.
- **Globalna obsługa wyjątków:** Stosowanie middleware do obsługi nieprzewidzianych wyjątków w celu zapewnienia spójnego formatu odpowiedzi błędów.

## 8. Rozważania dotyczące wydajności

- **Paginacja:** Zapobiega przeciążeniu serwera poprzez ograniczenie liczby jednoczesnych rekordów w odpowiedzi.
- **Optymalizacja zapytań:** Użycie złączy tylko z niezbędnymi tabelami i odpowiednie indeksowanie kolumn kluczowych (np. `recipes.id`, `macronutrients.recipe_id`).
- **Losowe wybieranie:** Dla opcji `random` rozważenie efektywnego mechanizmu, np. wykorzystanie funkcji bazy danych do losowego sortowania.
- **Cache:** Implementacja cache'owania w przypadku często zapytywanych rekordów może dodatkowo zwiększyć wydajność.

## 9. Etapy wdrożenia

1. **Walidacja parametrów:** Implementacja walidacji wejść przy użyciu Zod, aby zapewnić poprawność danych wejściowych.
2. **Tworzenie endpointu:** Dodanie endpointu do istniejącego pliku API (`src/pages/api/recipes.ts`) obsługującego metodę GET.
3. **Logika serwisowa:** Wyodrębnienie logiki pobierania danych do modułu serwisowego (`src/lib/services/recipeService.ts`), co umożliwi ponowne użycie kodu i lepszą organizację.
4. **Implementacja zapytań:** Budowa zapytań do bazy danych Supabase z uwzględnieniem wszystkich filtrów, paginacji i opcjonalnego losowego wyboru.
5. **Mapowanie wyników:** Konwersja wyników zapytań do typów `RecipeDto` i budowa obiektu `PagedRecipesResponse`.
6. **Obsługa błędów i logowanie:** Dodanie mechanizmów obsługi błędów oraz logowania wyjątków, w tym integracja z globalnym middleware błędów.
