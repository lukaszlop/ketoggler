export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      allergens: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          changed_at: string;
          changed_by: string | null;
          id: number;
          operation: string;
          record_id: number;
          table_name: string;
        };
        Insert: {
          changed_at?: string;
          changed_by?: string | null;
          id?: number;
          operation: string;
          record_id: number;
          table_name: string;
        };
        Update: {
          changed_at?: string;
          changed_by?: string | null;
          id?: number;
          operation?: string;
          record_id?: number;
          table_name?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          favorited_at: string;
          recipe_id: number;
          user_id: string;
        };
        Insert: {
          favorited_at?: string;
          recipe_id: number;
          user_id: string;
        };
        Update: {
          favorited_at?: string;
          recipe_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      ingredients: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      macronutrients: {
        Row: {
          calories: number;
          carbs: number;
          fats: number;
          protein: number;
          recipe_id: number;
        };
        Insert: {
          calories: number;
          carbs: number;
          fats: number;
          protein: number;
          recipe_id: number;
        };
        Update: {
          calories?: number;
          carbs?: number;
          fats?: number;
          protein?: number;
          recipe_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "macronutrients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: true;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_allergens: {
        Row: {
          allergen_id: number;
          recipe_id: number;
        };
        Insert: {
          allergen_id: number;
          recipe_id: number;
        };
        Update: {
          allergen_id?: number;
          recipe_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_allergens_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_ingredients: {
        Row: {
          ingredient_id: number;
          quantity: number;
          recipe_id: number;
          unit: string | null;
        };
        Insert: {
          ingredient_id: number;
          quantity: number;
          recipe_id: number;
          unit?: string | null;
        };
        Update: {
          ingredient_id?: number;
          quantity?: number;
          recipe_id?: number;
          unit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_versions: {
        Row: {
          changes: Json | null;
          recipe_id: number;
          recorded_at: string;
          version_id: number;
          version_number: number;
          version_type: Database["public"]["Enums"]["recipe_version_type"];
        };
        Insert: {
          changes?: Json | null;
          recipe_id: number;
          recorded_at?: string;
          version_id?: number;
          version_number: number;
          version_type: Database["public"]["Enums"]["recipe_version_type"];
        };
        Update: {
          changes?: Json | null;
          recipe_id?: number;
          recorded_at?: string;
          version_id?: number;
          version_number?: number;
          version_type?: Database["public"]["Enums"]["recipe_version_type"];
        };
        Relationships: [
          {
            foreignKeyName: "recipe_versions_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipes: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: number;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_allergens: {
        Row: {
          allergen_id: number;
          user_profile_id: number;
        };
        Insert: {
          allergen_id: number;
          user_profile_id: number;
        };
        Update: {
          allergen_id?: number;
          user_profile_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_allergens_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          created_at: string;
          dietary_preferences: string | null;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dietary_preferences?: string | null;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dietary_preferences?: string | null;
          id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      citext: {
        Args: { "": string } | { "": boolean } | { "": unknown };
        Returns: string;
      };
      citext_hash: {
        Args: { "": string };
        Returns: number;
      };
      citextin: {
        Args: { "": unknown };
        Returns: string;
      };
      citextout: {
        Args: { "": string };
        Returns: unknown;
      };
      citextrecv: {
        Args: { "": unknown };
        Returns: string;
      };
      citextsend: {
        Args: { "": string };
        Returns: string;
      };
    };
    Enums: {
      recipe_version_type: "original" | "modified";
    };
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      recipe_version_type: ["original", "modified"],
    },
  },
} as const;
