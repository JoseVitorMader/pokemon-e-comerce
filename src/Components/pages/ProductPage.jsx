import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../firebase";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";

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

  if (!product) return <div className="loading-state">Carregando produto...</div>;

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Voltar para produtos</Link>
      
      <div className="product-detail-container">
        <div className="product-detail-image">
          <img src={product.image || "https://via.placeholder.com/400"} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div className="product-detail-price-section">
            <div className="product-detail-price">R$ {product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
            {product.stock !== undefined && (
              <div className="product-detail-stock">
                {product.stock > 0 ? (
                  <span className="in-stock">✓ {product.stock} em estoque</span>
                ) : (
                  <span className="out-stock">Esgotado</span>
                )}
              </div>
            )}
          </div>

          <div className="product-detail-description">
            <h3>Descrição</h3>
            <p>{product.description || 'Produto original e de qualidade.'}</p>
          </div>

          <div className="product-detail-actions">
            <button 
              className="btn btn-add-cart" 
              onClick={() => { addItem(product); showToast('Produto adicionado ao carrinho', { type: 'success' }); }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Indisponível' : '🛒 Adicionar ao Carrinho'}
            </button>
          </div>

          <div className="product-detail-features">
            <div className="feature-item">🚚 Frete Grátis acima de R$ 200</div>
            <div className="feature-item">🔒 Compra 100% Segura</div>
            <div className="feature-item">↩️ Devolução em 7 dias</div>
          </div>
        </div>
      </div>
    </div>
  );
}
