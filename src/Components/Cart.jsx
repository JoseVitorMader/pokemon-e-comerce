import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Cart() {
  const { cart, removeItem, updateQty, total } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2>Carrinho</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          Carrinho vazio. <Link to="/products">Ver produtos</Link>
        </div>
      ) : (
        <div>
          {cart.map((it) => (
            <div key={it.id} className="cart-item">
              <img src={it.image || "https://via.placeholder.com/80"} alt={it.name} />
              <div style={{ flex: 1 }}>
                <strong>{it.name}</strong>
                <div className="muted">R$ {it.price}</div>
                <div className="qty-row">Quantidade: <input className="qty-input" type="number" value={it.qty} min={1} onChange={(e) => updateQty(it.id, Number(e.target.value))} /></div>
              </div>
              <div className="cart-actions">
                <button className="btn danger" onClick={() => { removeItem(it.id); showToast('Item removido do carrinho', { type: 'warning' }); }}>Remover</button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: R$ {total.toFixed(2)}</h3>
            <button className="btn" onClick={() => navigate("/checkout")}>Finalizar compra</button>
          </div>
        </div>
      )}
    </div>
  );
}
