# Dokument wymagań produktu (PRD) - KeToggler (MVP)

## 1. Przegląd produktu

Opis: KeToggler to aplikacja MVP, której celem jest ułatwienie dostosowywania dostępnych w sieci przepisów kulinarnych do wymagań diety ketogenicznej. Aplikacja umożliwia zarządzanie przepisami, oferuje integrację z AI do modyfikacji przepisów oraz wykorzystuje preferencje użytkownika do personalizacji wyników.

## 2. Problem użytkownika

Użytkownicy mają trudności z dopasowaniem standardowych przepisów do specyficznych wymagań diety ketogenicznej. Główne problemy to:

- Nadmierna ilość węglowodanów, niewystarczająca ilość tłuszczów lub nadmiar białka w przepisach.
- Brak znajomości zdrowych zamienników używanych składników.
- Niewystarczająca świadomość proporcji makroskładników w przygotowywanych posiłkach.

## 3. Wymagania funkcjonalne

- System umożliwia zapisywanie, odczytywanie, edytowanie i usuwanie przepisów w formie tekstowej.
- Każdy przepis musi zawierać:
  - Listę składników z możliwością wyboru substytutów niewskazanych produktów.
  - Makroskładniki oraz liczbę kalorii (mogą być generowane przez AI na podstawie listy składników).
  - Listę alergenów (generowaną przez AI na podstawie analizy składników).
- Użytkownicy mogą rejestrować się w systemie, przy czym wymagane są:
  - Weryfikacja e-mail.
  - Możliwość resetowania hasła.
- Strona profilu umożliwia zapisywanie preferencji żywieniowych (np. alergeny).
- Integracja z AI:
  - AI analizuje przepisy standardowe i ketogeniczne, aby proponować substytuty składników i ich ilości.
  - Użytkownik dokonuje wyboru proponowanych zmian.
- Wyszukiwarka przepisów umożliwia filtrowanie według:
  - Wartości kcal wprowadzanej przez użytkownika.
  - Listy alergenów (checkbox).
  - Maksymalnej liczby węglowodanów.
  - Personalizacji wyników na podstawie danych profilowych.
  - Funkcji generowania losowego przepisu.
- System wdroży nowoczesne metody zabezpieczeń, w tym:
  - Szyfrowanie danych.
  - Haszowanie haseł.
  - Komunikację przez HTTPS.
- Implementacja mechanizmu pop-up przypominającego użytkownikowi o uzupełnieniu brakujących danych profilowych (np. alergenów) podczas logowania.
- Przeprowadzenie testów walidacyjnych w celu minimalizacji ryzyka błędnych wyników działania AI.

## 4. Granice produktu

- MVP nie obejmuje importu przepisów z adresu URL.
- Brak obsługi multimediów (np. zdjęć przepisów).
- System nie przewiduje udostępniania przepisów pomiędzy użytkownikami.
- Nie uwzględniono funkcji społecznościowych.

## 5. Historyjki użytkowników

US-001
Tytuł: Rejestracja i weryfikacja konta
Opis: Użytkownik może zarejestrować się, podając adres e-mail i hasło, otrzymać e-mail weryfikacyjny oraz korzystać z funkcji resetowania hasła w przypadku zapomnienia.

Kryteria akceptacji:

- Użytkownik rejestruje konto i otrzymuje e-mail weryfikacyjny.
- Po weryfikacji użytkownik może się zalogować.
- Funkcja resetowania hasła działa poprawnie.

US-002
Tytuł: Zarządzanie profilem użytkownika
Opis: Użytkownik może uzupełnić swój profil o preferencje żywieniowe, w szczególności o alergeny.

Kryteria akceptacji:

- Użytkownik może edytować swoje dane profilowe.
- System wyświetla pop-up przypominający o uzupełnieniu brakujących danych, jeśli te nie zostały wprowadzone.

US-003
Tytuł: Dodawanie wyszukanego przepisu do ulubionych
Opis: Użytkownik przegląda listę wyników wyszukiwania przepisów. Po znalezieniu interesującego przepisu, może wybrać opcję "Dodaj do ulubionych". Wybrany przepis zostaje zapisany do listy ulubionych użytkownika. Dodatkowo, AI może opcjonalnie dokonać modyfikacji przepisu uwzględniających preferencje użytkownika, takich jak propozycje zamienników składników lub korekta ilości kalorii, tak aby przepis lepiej odpowiadał wymaganiom diety ketogenicznej.

Kryteria akceptacji:

- Przepis z wyników wyszukiwania może zostać dodany do listy ulubionych użytkownika.
- Po dodaniu, przepis jest widoczny w sekcji 'Ulubione' użytkownika.
- Jeśli AI dokonuje modyfikacji przepisu, proponowane zmiany są wyświetlane użytkownikowi przed ostatecznym zatwierdzeniem, umożliwiając akceptację lub odrzucenie modyfikacji.

US-004
Tytuł: Edycja i usuwanie przepisu
Opis: Użytkownik może edytować lub usuwać wcześniej dodane przepisy.

Kryteria akceptacji:

- Zmiany w przepisie są zapisywane bez błędów.
- Usunięty przepis nie jest widoczny w systemie.

US-005
Tytuł: Wyszukiwanie i filtrowanie przepisów
Opis: Użytkownik korzysta z wyszukiwarki, która umożliwia filtrowanie przepisów według:

- Wartości kcal, wpisywanej przez użytkownika
- Listy alergenów (checkbox)
- Maksymalnej liczby węglowodanów
- Personalizacji wyników na podstawie danych profilowych
- Opcji generowania losowego przepisu

  Kryteria akceptacji:

- Filtry działają poprawnie, a wyniki wyszukiwania odpowiadają wprowadzonym kryteriom.
- Opcja losowego przepisu generuje wyniki zgodne z filtrami.

US-006
Tytuł: Integracja AI do modyfikacji przepisu
Opis: Po wybraniu przepisu, AI analizuje wersję standardową i alternatywę ketogeniczną, proponując substytuty składników wraz z ich ilościami, umożliwiając użytkownikowi wybór najodpowiedniejszej modyfikacji.

Kryteria akceptacji:

- AI poprawnie analizuje przepis i proponuje alternatywne składniki.
- Użytkownik może zatwierdzić lub odrzucić zaproponowane zmiany.

US-007
Tytuł: Bezpieczny dostęp i logowanie
Opis: System zapewnia bezpieczny dostęp za pomocą uwierzytelniania, szyfrowania danych, haszowania haseł oraz komunikacji przez HTTPS.

Kryteria akceptacji:

- Proces logowania i wylogowania działa zgodnie z wymaganiami bezpieczeństwa.
- Funkcje resetowania hasła działają poprawnie.

US-008
Tytuł: Powiadomienia o uzupełnieniu danych profilowych
Opis: System wyświetla pop-up przypominający o uzupełnieniu brakujących danych (np. alergenów) w profilu, jeśli użytkownik ich jeszcze nie uzupełnił.

Kryteria akceptacji:

- Pop-up pojawia się podczas logowania, gdy dane profilowe są niekompletne.

## 6. Metryki sukcesu

- 90% użytkowników posiada wypełnioną sekcję preferencji żywieniowych w swoim profilu.
- 75% użytkowników generuje jeden lub więcej przepisów tygodniowo.
- Monitorowanie liczby aktywnych użytkowników, częstotliwości wyszukiwań oraz liczby zapisanych ulubionych przepisów przy użyciu Google Analytics.
- Wyniki testów walidacyjnych funkcjonalności AI (minimalizacja ryzyka halucynacji, błędnych modyfikacji i opóźnień w przetwarzaniu).
