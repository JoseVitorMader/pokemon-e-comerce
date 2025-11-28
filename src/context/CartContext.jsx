import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(cart));
  }, [cart]);

  function addItem(item) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p));
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateQty(id, qty) {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  const total = cart.reduce((s, it) => s + (it.price || 0) * it.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, updateQty, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
