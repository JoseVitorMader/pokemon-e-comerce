import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../../firebase";
import { useToast } from "../../../context/ToastContext";
import { useCart } from "../../../context/CartContext";
import { Container, Row, Col, Button, Badge, Card, ListGroup } from "react-bootstrap";
import { FaCheck, FaShoppingCart, FaTruck, FaLock } from "react-icons/fa";

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
    <Container className="product-detail-page">
      <Link to="/" className="back-link">← Voltar para produtos</Link>
      
      <div className="product-detail-container">
        <div className="product-detail-image">
          <Card.Img src={product.image || "https://via.placeholder.com/400"} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div className="product-detail-price-section">
            <div className="product-detail-price">R$ {product.price?.toFixed ? product.price.toFixed(2) : product.price}</div>
            {product.stock !== undefined && (
              <div className="product-detail-stock">
                {product.stock > 0 ? (
                  <Badge bg="success" className="in-stock"><FaCheck /> {product.stock} em estoque</Badge>
                ) : (
                  <Badge bg="danger" className="out-stock">Esgotado</Badge>
                )}
              </div>
            )}
          </div>

          <div className="product-detail-description">
            <h3>Descrição</h3>
            <p>{product.description || 'Produto original e de qualidade.'}</p>
          </div>

          <div className="product-detail-actions">
            <Button 
              variant="primary" 
              size="lg"
              className="w-100 btn-add-cart"
              onClick={() => { addItem(product); showToast('Produto adicionado ao carrinho', { type: 'success' }); }}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Indisponível' : <><FaShoppingCart /> Adicionar ao Carrinho</>}
            </Button>
          </div>

          <ListGroup className="product-detail-features">
            <ListGroup.Item className="feature-item"><FaTruck /> Frete Grátis acima de R$ 200</ListGroup.Item>
            <ListGroup.Item className="feature-item"><FaLock /> Compra 100% Segura</ListGroup.Item>
            <ListGroup.Item className="feature-item">↩️ Devolução em 7 dias</ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    </Container>
  );
}
