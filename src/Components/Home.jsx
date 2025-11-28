import React, { useEffect, useState } from "react";
import { subscribeProducts } from "../firebase";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeProducts((list) => setProducts(list));
    return () => unsubscribe && unsubscribe();
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="hero-banner">
        <div className="banner-content">
          <h1>🔥 Digimon Action Figures</h1>
          <p>Colecionáveis oficiais com entrega rápida</p>
        </div>
      </section>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="products-section">
        <h2>Todos os Produtos</h2>
        <div className="grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999' }}>
              Nenhum produto encontrado.
            </div>
          ) : (
            filtered.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="card" style={{ textDecoration: 'none' }}>
                <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                <h3>{p.name}</h3>
                <div className="price">
                  <span className="value">R$ {p.price?.toFixed ? p.price.toFixed(2) : p.price}</span>
                </div>
                {p.stock !== undefined && (
                  <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {p.stock > 0 ? `${p.stock} disponíveis` : 'Esgotado'}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
