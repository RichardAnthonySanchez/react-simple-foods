import type { FoodItem } from "../types/FoodItem";

export const CustomerCart = ({
  cart,
  removeFromCart,
}: {
  cart: FoodItem[];
  removeFromCart: (fdc_id: string) => void;
}) => {
  return cart.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <ul className="items-container card p-4 mt-4 bg-base-200">
      {cart.map((item) => (
        <li
          className="bg-base-100 shadow-sm hover:shadow-2xl my-4 p-4 rounded-lg"
          key={item.fdc_id}
        >
          <strong>{item.product_name}</strong> —{" "}
          {item.brand_owner || "Unknown brand"}
          <div className="product-buttons flex flex-row justify-end mt-2">
            <button
              className="btn btn-outline btn-error"
              onClick={() => removeFromCart(item.fdc_id)}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
