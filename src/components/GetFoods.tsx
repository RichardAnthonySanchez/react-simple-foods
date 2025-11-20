import { useState, useEffect } from "react";
import type { FoodItem } from "../types/FoodItem";
import { CustomerCart } from "./CustomerCart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function GetFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [clientCarts, setClientCarts] = useState<Record<string, FoodItem[]>>(
    {}
  );
  const [clients, setClients] = useState<string[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showFood, setShowFood] = useState<boolean>(true);
  const [showClients, setShowClients] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>("");

  useEffect(() => {
    const HOST = import.meta.env.VITE_HOST;
    fetch(`${HOST}/api/v1/foods`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
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
    if (!activeClient) return alert("Select a client first.");
    const updated = [...cart, food];
    setCart(updated);
    setClientCarts((prev) => ({ ...prev, [activeClient]: updated }));
  };

  const removeFromCart = (fdc_id: string) => {
    if (!activeClient) return;
    const updated = cart.filter((item) => item.fdc_id !== fdc_id);
    setCart(updated);
    setClientCarts((prev) => ({ ...prev, [activeClient]: updated }));
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

  const addClient = () => {
    if (!newClientName.trim()) return;
    if (clients.includes(newClientName)) return;

    setClients([...clients, newClientName]);
    setClientCarts((prev) => ({ ...prev, [newClientName]: [] }));
    setNewClientName("");
  };

  const selectClient = (name: string) => {
    setActiveClient(name);
    setCart(clientCarts[name] || []);
    setShowClients(false);
    setShowFood(false);
    setShowCart(true);
  };

  return (
    <div className="foods-container flex flex-col items-center bg-base-300 px-4 min-h-screen">
      {/* Search */}
      <label className="input mt-4 rounded-2xl">
        <input
          className="text-center"
          type="Search"
          placeholder="Search food items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      {/* Menu */}
      <ul className="menu menu-horizontal flex flex-row justify-around mt-4 w-100">
        <li>
          <a
            onClick={() => {
              setShowClients(true);
              setShowFood(false);
              setShowCart(false);
            }}
          >
            Clients
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setShowFood(true);
              setShowCart(false);
              setShowClients(false);
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
              setShowClients(false);
            }}
          >
            Cart
          </a>
        </li>
      </ul>

      {/* Clients Section */}
      {showClients && (
        <div className="card p-4 mt-4 bg-base-200 w-full max-w-md">
          <h2 className="text-xl font-bold mb-3">Clients</h2>

          <div className="flex mb-4">
            <input
              className="input input-bordered w-full mr-2"
              placeholder="New client name"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
            />
            <button className="btn btn-success" onClick={addClient}>
              Add
            </button>
          </div>

          <ul>
            {clients.map((client) => (
              <li
                key={client}
                className="p-2 my-2 bg-base-100 rounded cursor-pointer hover:bg-base-300"
                onClick={() => selectClient(client)}
              >
                {client}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Foods Section */}
      {showFood && (
        <ul className="items-container card p-4 mt-4 bg-base-200">
          {error && <p>{error}</p>}
          {filteredFoods.length === 0 && !searchTerm && <p>Loading foods...</p>}
          {filteredFoods.length === 0 && searchTerm && (
            <p>No items found matching that query.</p>
          )}

          {filteredFoods.map((food) => (
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
          ))}
        </ul>
      )}

      {/* Cart Section */}
      {showCart && (
        <div className="flex flex-col grow w-full max-w-lg">
          {!activeClient && (
            <p className="text-center mt-4">Select a client to begin.</p>
          )}

          {activeClient && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
