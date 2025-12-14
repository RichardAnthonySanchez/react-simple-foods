export type MealTag = "keto" | "dairy free" | "gluten free" | "vegan";

export interface Meal {
    id: string;
    title: string | null;
    servings: number | null;
    prepTime: number | null;
    cookTime: number | null;
    totalTime: number | null;
    author: string | null;
    tags: MealTag[];
    image: string | null;
    ingredients: string[];
    directions: string[];
    links: string[];
}