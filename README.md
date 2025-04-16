# KeToggler (MVP)

## 1. Project Description
KeToggler (MVP) is an application designed to help users adjust online culinary recipes to meet the requirements of a ketogenic diet. By leveraging AI, the app analyzes standard recipes and proposes modifications – such as ingredient substitutions and recalculated calorie/macro ratios – based on individual user preferences.

## 2. Tech Stack
- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui
  Astro enables fast, performant static sites while React provides interactivity where needed. TypeScript helps catch errors early, Tailwind ensures efficient styling, and Shadcn/ui offers a library of prebuilt UI components.
- **Backend:** Supabase
  Provides a PostgreSQL database along with built-in authentication and a developer-friendly Backend-as-a-Service framework.
- **AI Integration:** Openrouter.ai
  Facilitates communication with various AI models to analyze and modify recipes efficiently.
- **CI/CD & Hosting:** GitHub Actions & DigitalOcean
  GitHub Actions manages automated testing and deployment pipelines, while DigitalOcean handles hosting via a Docker-based deployment.

## 3. Getting Started Locally
1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```
2. **Set the Node version:**
   Ensure you are using Node version specified in the `.nvmrc` file (**v22.14.0**). You can use [nvm](https://github.com/nvm-sh/nvm) to switch versions:
   ```bash
   nvm use
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Preview the production build:**
   ```bash
   npm run build
   npm run preview
   ```

## 4. Available Scripts
- **npm run dev:** Start the Astro development server.
- **npm run build:** Build the project for production.
- **npm run preview:** Preview the production build locally.
- **npm run astro:** Run Astro CLI commands.
- **npm run lint:** Check the code for linting issues.
- **npm run lint:fix:** Automatically fix linting errors.
- **npm run format:** Format code using Prettier.

## 5. Project Scope
- **In Scope (MVP):**
  - Recipe searching functionality.
  - AI-driven modification of recipes (e.g., ingredient substitutions and calorie/macro adjustments) to better meet ketogenic diet requirements.
  - A user interface focused solely on searching and displaying modified recipes.
- **Out of Scope:**
  - Importing recipes from external URLs.
  - Extensive multimedia support (e.g., images).
  - Social or sharing features.

## 6. Project Status
This project is in the MVP stage, currently focusing on developing the core functionality of recipe search and AI-driven recipe adjustments. Future development phases may expand features based on user feedback and scalability requirements.

## 7. License
This project is licensed under the MIT License.