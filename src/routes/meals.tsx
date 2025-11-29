import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

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

const HOST = import.meta.env.VITE_HOST;
export const Route = createFileRoute("/meals")({
  validateSearch: (search) => {
    const raw = search.tags;
    const tags = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return { tags };
  },
  component: MealsPage,
});

function MealsPage() {
  const { tags } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(`${HOST}/api/v1/meals`);
      const { data }: { data: Meal[] } = await response.json();
      setMeals(data);
      setLoading(false);
    };

    fetchMeals();
  }, []);

  const toggle = (tag: MealTag) => {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    navigate({
      search: { tags: next },
    });
  };

  const allTags: MealTag[] = ["keto", "dairy free", "gluten free", "vegan"];

  const filtered =
    tags.length > 0
      ? meals.filter((meal) =>
          tags.every((t) => meal.tags.includes(t as MealTag))
        )
      : meals;

  return (
    <div style={{ padding: 20 }}>
      <h1>Meals</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            style={{
              padding: "6px 12px",
              border: "1px solid #aaa",
              borderRadius: 6,
              background: tags.includes(tag) ? "#0af" : "#eee",
              color: tags.includes(tag) ? "white" : "black",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filtered.map((meal) => (
            <li key={meal.id}>
              {meal.title} — <i>{JSON.stringify(meal.tags || [])}</i>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
