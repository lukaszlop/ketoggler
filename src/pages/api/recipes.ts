import type { APIRoute } from "astro";
import { ZodError } from "zod";
import { createRecipeSchema } from "../../lib/schemas/recipes";
import { createRecipe } from "../../lib/services/recipes.service";

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
