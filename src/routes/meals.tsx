import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export type MealTag = "vegan" | "quick" | "breakfast" | "dessert";

export interface Meal {
  id: string;
  name: string;
  tags: MealTag[];
}

const ALL_MEALS: Meal[] = [
  { id: "1", name: "Avocado Toast", tags: ["vegan", "breakfast"] },
  { id: "2", name: "Berry Smoothie", tags: ["vegan", "quick", "breakfast"] },
  { id: "3", name: "Pasta Alfredo", tags: ["quick"] },
  { id: "4", name: "Chocolate Cake", tags: ["dessert"] },
];

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
  const [filtered, setFiltered] = useState<Meal[]>([]);

  useEffect(() => {
    if (tags.length === 0) {
      setFiltered(ALL_MEALS);
    } else {
      setFiltered(
        ALL_MEALS.filter((meal) =>
          tags.every((t) => meal.tags.includes(t as MealTag))
        )
      );
    }
  }, [tags]);

  const toggle = (tag: MealTag) => {
    const next = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    navigate({
      search: { tags: next },
    });
  };

  const allTags: MealTag[] = ["vegan", "quick", "breakfast", "dessert"];

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

      <ul>
        {filtered.map((meal) => (
          <li key={meal.id}>
            {meal.name} — <i>{meal.tags.join(", ")}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
