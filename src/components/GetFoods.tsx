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
  const [showFood, setShowFood] = useState<boolean>(true);

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

  return (
    <div className="foods-container flex flex-col items-center bg-base-300 px-4 min-h-screen">
      <label className="input mt-4 rounded-2xl">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          className="text-center"
          type="Search"
          placeholder="Search food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      <ul className="menu menu-horizontal flex flex-row justify-around mt-4 w-100">
        <li>
          <a
            onClick={() => {
              setShowFood(true);
              setShowCart(false);
            }}
          >
            Browse
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setShowCart(true);
              setShowFood(false);
            }}
          >
            Cart
          </a>
        </li>
        <li>
          <a>Checkout</a>
        </li>
      </ul>

      {showFood && (
        <ul className="items-container card p-4 mt-4 bg-base-200">
          {error && <p>{error}</p>}
          {filteredFoods.length === 0 && !searchTerm ? (
            <p>Loading foods...</p>
          ) : null}
          {filteredFoods.length === 0 && searchTerm ? (
            <p>No items found matching that query.</p>
          ) : (
            filteredFoods.map((food) => (
              <li
                className="bg-base-100 shadow-sm hover:shadow-2xl my-4 p-4 rounded-lg"
                key={food.fdc_id}
              >
                <strong>{food.product_name}</strong> —{" "}
                {food.brand_owner || "Unknown brand"}
                <div className="product-buttons flex flex-row justify-end mt-2">
                  <button
                    className="btn btn-outline btn-success"
                    onClick={() => addToCart(food)}
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {showCart && (
        <div className="flex flex-col grow">
          <CustomerCart cart={cart} removeFromCart={removeFromCart} />
          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-base-200 p-4">
              <button
                className="btn btn-success w-full"
                onClick={downloadCartAsPDF}
              >
                Download items
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
