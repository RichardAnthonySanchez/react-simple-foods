import { useState, useEffect } from "react";
import type { FoodItem } from "../types/FoodItem";
import { CustomerCart } from "./CustomerCart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function GetFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCart, setShowCart] = useState<boolean>(false);

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

  const addToCart = (food: FoodItem) => {
    setCart([...cart, food]);
  };

  const removeFromCart = (fdc_id: string) => {
    setCart(cart.filter((item) => item.fdc_id !== fdc_id));
  };

  const downloadCartAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Cart", 14, 16);

    const data = cart.map((item) => [
      item.product_name,
      item.brand_owner || "Unknown brand",
    ]);
    autoTable(doc, {
      head: [["Product Name", "Brand"]],
      body: data,
      startY: 20,
    });

    doc.save("customer_cart.pdf");
  };

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
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowCart(!showCart)}>
        {showCart ? "Hide Cart" : "Show Cart"}
      </button>
      {showCart && (
        <div>
          <h2>Customer Cart</h2>
          <CustomerCart cart={cart} removeFromCart={removeFromCart} />
          <button onClick={downloadCartAsPDF}>Download Cart as PDF</button>
        </div>
      )}
    </div>
  );
}
