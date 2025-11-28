import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../firebase";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    getProductById(id).then((p) => {
      if (mounted) setProduct(p);
    });
    return () => (mounted = false);
  }, [id]);

  if (!product) return <div>Carregando produto...</div>;

  return (
    <div>
      <Link to="/products" className="back-link">← Voltar</Link>
      <h2>{product.name}</h2>
      <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} style={{ maxWidth: 400 }} />
      <p>{product.description}</p>
      <p>R$ {product.price?.toFixed ? product.price.toFixed(2) : product.price}</p>
      <button className="btn add-to-cart" onClick={() => { addItem(product); showToast('Produto adicionado ao carrinho', { type: 'success' }); }}>Adicionar ao carrinho</button>
    </div>
  );
}
