import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setProcessing(true);
    // Mock payment/checkout: In production integrate Stripe, PayPal, etc.
    await new Promise((r) => setTimeout(r, 1000));
    clearCart();
    setProcessing(false);
    showToast("Pedido realizado com sucesso!", { type: 'success' });
    navigate("/products");
  }

  if (cart.length === 0) return <div>Carrinho vazio.</div>;

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handlePlaceOrder} style={{ maxWidth: 500 }}>
        <div>
          <label>Nome completo</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Endereço</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>
        <div>
          <button type="submit" disabled={processing}>{processing ? "Processando..." : "Pagar"}</button>
        </div>
      </form>
    </div>
  );
}
