import { useState, useEffect } from "react";
import type { FoodItem } from "../types/FoodItem";

export function GetFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const HOST = import.meta.env.VITE_HOST;
    fetch(`${HOST}/api/v1/foods`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setFoods(data.data);
        setFilteredFoods(data.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const results = foods.filter((food) =>
      food.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(results);
  }, [searchTerm, foods]);

  if (error) return <p>{error}</p>;
  if (filteredFoods.length === 0) return <p>Loading foods...</p>;

  return (
    <div>
      <h1>Food Products</h1>
      <input
        type="text"
        placeholder="Search food items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredFoods.map((food) => (
          <li key={food.fdc_id}>
            <strong>{food.product_name}</strong> —{" "}
            {food.brand_owner || "Unknown brand"}
          </li>
        ))}
      </ul>
    </div>
  );
}
