-- Migration: Initial Schema Setup
-- Description: Creates the initial database schema for the KeToggler application
-- Tables: user_profiles, recipes, recipe_versions, macronutrients, ingredients,
--         recipe_ingredients, allergens, recipe_allergens, user_allergens,
--         favorites, audit_log
-- Author: Database Migration System
-- Date: 2024-04-19

-- Enable necessary extensions
create extension if not exists "citext";

-- Create custom types
create type recipe_version_type as enum ('original', 'modified');

-- Create functions first (before tables that might use them)
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace function process_audit_log()
returns trigger as $$
begin
    insert into audit_log (table_name, record_id, operation, changed_by)
    values (
        tg_table_name::varchar,
        case when tg_op = 'DELETE' then old.id else new.id end,
        tg_op,
        auth.uid()
    );
    return coalesce(new, old);
end;
$$ language plpgsql;

-- Create tables
create table user_profiles (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    dietary_preferences text,
    created_at timestamp with time zone default now() not null,
    constraint user_profiles_user_id_key unique (user_id)
);

create table recipes (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title varchar(255) not null,
    description text not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

create table recipe_versions (
    version_id bigserial primary key,
    recipe_id bigint references recipes(id) on delete cascade not null,
    version_type recipe_version_type not null,
    version_number integer not null,
    changes jsonb,
    recorded_at timestamp with time zone default now() not null
);

create table macronutrients (
    recipe_id bigint primary key references recipes(id) on delete cascade,
    calories integer not null check (calories >= 0),
    protein numeric(5,2) not null check (protein >= 0),
    carbs numeric(5,2) not null check (carbs >= 0),
    fats numeric(5,2) not null check (fats >= 0)
);

create table ingredients (
    id bigserial primary key,
    name varchar(255) not null,
    constraint ingredients_name_key unique (name)
);

create table recipe_ingredients (
    recipe_id bigint references recipes(id) on delete cascade not null,
    ingredient_id bigint references ingredients(id) on delete cascade not null,
    quantity numeric(10,2) not null check (quantity >= 0),
    unit varchar(50),
    primary key (recipe_id, ingredient_id)
);

create table allergens (
    id bigserial primary key,
    name varchar(255) not null,
    constraint allergens_name_key unique (name)
);

create table recipe_allergens (
    recipe_id bigint references recipes(id) on delete cascade not null,
    allergen_id bigint references allergens(id) on delete cascade not null,
    primary key (recipe_id, allergen_id)
);

create table user_allergens (
    user_profile_id bigint references user_profiles(id) on delete cascade not null,
    allergen_id bigint references allergens(id) on delete cascade not null,
    primary key (user_profile_id, allergen_id)
);

create table favorites (
    user_id uuid references auth.users(id) on delete cascade not null,
    recipe_id bigint references recipes(id) on delete cascade not null,
    favorited_at timestamp with time zone default now() not null,
    primary key (user_id, recipe_id)
);

create table audit_log (
    id bigserial primary key,
    table_name varchar(255) not null,
    record_id bigint not null,
    operation varchar(50) not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
    changed_at timestamp with time zone default now() not null,
    changed_by uuid references auth.users(id)
);

-- Create indexes (after tables are created)
create index recipes_user_id_idx on recipes(user_id);
create index macronutrients_calories_idx on macronutrients(calories);
create index macronutrients_carbs_idx on macronutrients(carbs);

-- Create triggers (after both functions and tables exist)
create trigger update_recipes_updated_at
    before update on recipes
    for each row
    execute function update_updated_at_column();

create trigger audit_recipes_changes
    after insert or update or delete on recipes
    for each row
    execute function process_audit_log();

-- Enable Row Level Security
alter table user_profiles enable row level security;
alter table recipes enable row level security;
alter table recipe_versions enable row level security;
alter table macronutrients enable row level security;
alter table ingredients enable row level security;
alter table recipe_ingredients enable row level security;
alter table allergens enable row level security;
alter table recipe_allergens enable row level security;
alter table user_allergens enable row level security;
alter table favorites enable row level security;
alter table audit_log enable row level security;

-- Create policies for user_profiles
create policy "Users can view their own profile"
    on user_profiles for select
    using (auth.uid() = user_id);

create policy "Users can update their own profile"
    on user_profiles for update
    using (auth.uid() = user_id);

create policy "Users can insert their own profile"
    on user_profiles for insert
    with check (auth.uid() = user_id);

-- Create policies for recipes
create policy "Anon users can view recipes"
    on recipes for select
    to anon
    using (true);

create policy "Auth users can view recipes"
    on recipes for select
    to authenticated
    using (true);

create policy "Users can create their own recipes"
    on recipes for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
    on recipes for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own recipes"
    on recipes for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create policies for recipe_versions
create policy "Anon users can view recipe versions"
    on recipe_versions for select
    to anon
    using (true);

create policy "Auth users can view recipe versions"
    on recipe_versions for select
    to authenticated
    using (true);

create policy "Recipe owners can manage versions"
    on recipe_versions for all
    to authenticated
    using (
        exists (
            select 1 from recipes
            where recipes.id = recipe_versions.recipe_id
            and recipes.user_id = auth.uid()
        )
    );

-- Create policies for macronutrients
create policy "Anon users can view macronutrients"
    on macronutrients for select
    to anon
    using (true);

create policy "Auth users can view macronutrients"
    on macronutrients for select
    to authenticated
    using (true);

create policy "Recipe owners can manage macronutrients"
    on macronutrients for all
    to authenticated
    using (
        exists (
            select 1 from recipes
            where recipes.id = macronutrients.recipe_id
            and recipes.user_id = auth.uid()
        )
    );

-- Create policies for ingredients (public reference data)
create policy "Anon users can view ingredients"
    on ingredients for select
    to anon
    using (true);

create policy "Auth users can view ingredients"
    on ingredients for select
    to authenticated
    using (true);

create policy "Authenticated users can add ingredients"
    on ingredients for insert
    to authenticated
    with check (true);

-- Create policies for recipe_ingredients
create policy "Anon users can view recipe ingredients"
    on recipe_ingredients for select
    to anon
    using (true);

create policy "Auth users can view recipe ingredients"
    on recipe_ingredients for select
    to authenticated
    using (true);

create policy "Recipe owners can manage ingredients"
    on recipe_ingredients for all
    to authenticated
    using (
        exists (
            select 1 from recipes
            where recipes.id = recipe_ingredients.recipe_id
            and recipes.user_id = auth.uid()
        )
    );

-- Create policies for allergens (public reference data)
create policy "Anon users can view allergens"
    on allergens for select
    to anon
    using (true);

create policy "Auth users can view allergens"
    on allergens for select
    to authenticated
    using (true);

create policy "Authenticated users can add allergens"
    on allergens for insert
    to authenticated
    with check (true);

-- Create policies for recipe_allergens
create policy "Anon users can view recipe allergens"
    on recipe_allergens for select
    to anon
    using (true);

create policy "Auth users can view recipe allergens"
    on recipe_allergens for select
    to authenticated
    using (true);

create policy "Recipe owners can manage allergens"
    on recipe_allergens for all
    to authenticated
    using (
        exists (
            select 1 from recipes
            where recipes.id = recipe_allergens.recipe_id
            and recipes.user_id = auth.uid()
        )
    );

-- Create policies for user_allergens
create policy "Users can view their allergens"
    on user_allergens for select
    to authenticated
    using (
        exists (
            select 1 from user_profiles
            where user_profiles.id = user_allergens.user_profile_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can manage their allergens"
    on user_allergens for all
    to authenticated
    using (
        exists (
            select 1 from user_profiles
            where user_profiles.id = user_allergens.user_profile_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Create policies for favorites
create policy "Users can view their favorites"
    on favorites for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can manage their favorites"
    on favorites for all
    to authenticated
    using (auth.uid() = user_id);

-- Create policies for audit_log
create policy "Users can view their audit logs"
    on audit_log for select
    to authenticated
    using (auth.uid() = changed_by);