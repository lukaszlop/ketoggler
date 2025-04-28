import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { GetRecipesQuerySchema, createRecipeSchema } from "../../lib/schemas/recipes";
import { createRecipe, getRecipes } from "../../lib/services/recipes.service";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const validatedBody = createRecipeSchema.parse(body);

    const recipe = await createRecipe(validatedBody, locals.supabase);

    return new Response(JSON.stringify(recipe), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ error: "ValidationError", message: error.flatten() }), { status: 400 });
    }

    console.error("Error creating recipe:", error);
    return new Response(JSON.stringify({ error: "ServerError", message: "Internal server error" }), { status: 500 });
  }
};

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const validatedParams = GetRecipesQuerySchema.safeParse(queryParams);

    if (!validatedParams.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: validatedParams.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch recipes using service
    const result = await getRecipes(validatedParams.data, locals.supabase);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
