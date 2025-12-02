import React, { useEffect, useState } from "react";
import { subscribeProducts } from "../../firebase";
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
          <div className="banner-tag">NOVA COLEÇÃO</div>
          <h1>🔥 Digimon Action Figures</h1>
          <p>Colecionáveis oficiais com entrega rápida • Frete Grátis acima de R$ 200</p>
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
              <Link to={`/product/${p.id}`} key={p.id} className="product-card" style={{ textDecoration: 'none' }}>
                <div className="product-image-container">
                  <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                  {p.stock !== undefined && p.stock === 0 && (
                    <div className="badge badge-out">Esgotado</div>
                  )}
                  {p.stock > 0 && p.stock < 5 && (
                    <div className="badge badge-limited">Últimas unidades</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-title">{p.name}</h3>
                  <div className="product-price-row">
                    <div className="price-main">R$ {p.price?.toFixed ? p.price.toFixed(2) : p.price}</div>
                  </div>
                  {p.stock !== undefined && p.stock > 0 && (
                    <div className="product-stock">✓ {p.stock} disponíveis</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
