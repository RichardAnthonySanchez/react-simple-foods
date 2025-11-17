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
    <ul>
      {cart.map((item) => (
        <li key={item.fdc_id}>
          <strong>{item.product_name}</strong> —{" "}
          {item.brand_owner || "Unknown brand"}
          <button onClick={() => removeFromCart(item.fdc_id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};
