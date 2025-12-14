import { useState, useEffect } from "react";
import { CustomerCart } from "./CustomerCart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Meal } from "../types/Meal";

export function GetMeals() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [cart, setCart] = useState<Meal[]>([]);
    const [clientCarts, setClientCarts] = useState<Record<string, Meal[]>>({});
    const [clients, setClients] = useState<string[]>([]);
    const [activeClient, setActiveClient] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showCart, setShowCart] = useState<boolean>(false);
    const [showMeals, setShowMeals] = useState<boolean>(true);
    const [showClients, setShowClients] = useState<boolean>(false);
    const [newClientName, setNewClientName] = useState<string>("");

    useEffect(() => {
        const HOST = import.meta.env.VITE_HOST;
        fetch(`${HOST}/api/v1/meals`)
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setMeals(data.data);
                setFilteredMeals(data.data);
            })
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        const results = meals.filter(
            (meal) =>
                meal.title &&
                meal.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMeals(results);
    }, [searchTerm, meals]);

    const addToCart = (meal: Meal) => {
        if (!activeClient) return alert("Select a client first.");
        const updated = [...cart, meal];
        setCart(updated);
        setClientCarts((prev) => ({ ...prev, [activeClient]: updated }));
    };

    const removeFromCart = (id: string) => {
        if (!activeClient) return;
        const updated = cart.filter((item) => item.id !== id);
        setCart(updated);
        setClientCarts((prev) => ({ ...prev, [activeClient]: updated }));
    };

    const downloadCartAsPDF = () => {
        const doc = new jsPDF();
        doc.text("Customer Cart", 14, 16);
        const data = cart.map((item) => [
            item.title || "Unknown title",
            item.author || "Unknown author",
        ]);
        autoTable(doc, {
            head: [["Meal Name", "Author"]],
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
        setShowMeals(false);
        setShowCart(true);
    };

    return (
        <div className="meals-container flex flex-col items-center bg-base-300 px-4 min-h-screen">
            {/* Search */}
            <label className="input mt-4 rounded-2xl">
                <input
                    className="text-center"
                    type="Search"
                    placeholder="Search meals..."
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
                            setShowMeals(false);
                            setShowCart(false);
                        }}
                    >
                        Clients
                    </a>
                </li>
                <li>
                    <a
                        onClick={() => {
                            setShowMeals(true);
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
                            setShowMeals(false);
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

            {/* Meals Section */}
            {showMeals && (
                <ul className="items-container card p-4 mt-4 bg-base-200">
                    {error && <p>{error}</p>}
                    {filteredMeals.length === 0 && !searchTerm && <p>Loading meals...</p>}
                    {filteredMeals.length === 0 && searchTerm && (
                        <p>No items found matching that query.</p>
                    )}

                    {filteredMeals.map((meal) => (
                        <li
                            className="bg-base-100 shadow-sm hover:shadow-2xl my-4 p-4 rounded-lg"
                            key={meal.id}
                        >
                            <strong>{meal.title}</strong> — {meal.author || "Unknown author"}
                            <div className="product-buttons flex flex-row justify-end mt-2">
                                <button
                                    className="btn btn-outline btn-success"
                                    onClick={() => addToCart(meal)}
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
