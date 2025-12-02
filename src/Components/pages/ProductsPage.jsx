import React, { useEffect, useState } from "react";
import { subscribeProducts } from "../../firebase";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeProducts((list) => setProducts(list));
    // onValue returns an unsubscribe function
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div>
      <h2>Action Figures de Digimon</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "1rem" }}>
        {products.length === 0 ? (
          <div>Nenhum produto encontrado.</div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="card">
              <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} style={{ width: "100%" }} />
              <h3>{p.name}</h3>
              <p>R$ {p.price?.toFixed ? p.price.toFixed(2) : p.price}</p>
              <Link to={`/product/${p.id}`}>Ver produto</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
