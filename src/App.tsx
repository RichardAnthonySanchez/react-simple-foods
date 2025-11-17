import { useEffect, useState } from "react";
interface FoodItem {
  fdc_id: string;
  brand_owner: string | null;
  brand_name: string | null;
  subbrand_name: string | null;
  gtin_upc: string;
  ingredients: string | null;
  serving_size: string | null;
  serving_size_unit: string | null;
  household_serving_fulltext: string | null;
  branded_food_category: string | null;
  data_source: string | null;
  product_name: string;
  energy_kcal_100g: string | null;
  fat_100g: string | null;
  saturated_fat_100g: string | null;
}

function App() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const HOST = import.meta.env.VITE_HOST;
    fetch(`${HOST}/api/v1/foods`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setFoods(data.data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (foods.length === 0) return <p>Loading foods...</p>;

  return (
    <div>
      <h1>Food Products</h1>
      <ul>
        {foods.map((food) => (
          <li key={food.fdc_id}>
            <strong>{food.product_name}</strong> —{" "}
            {food.brand_owner || "Unknown brand"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
