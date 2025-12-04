import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

export default function QuickViewModal({ show, onHide, product, onAddToCart }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ borderBottom: '2px solid #f0f0f0' }}>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-5">
            <img 
              src={product.image || "https://via.placeholder.com/400"} 
              alt={product.name}
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div className="col-md-7">
            <div className="mb-3">
              {product.category && (
                <Badge bg="primary" className="me-2">{product.category}</Badge>
              )}
              {product.stock > 0 ? (
                <Badge bg="success">Em estoque ({product.stock})</Badge>
              ) : (
                <Badge bg="danger">Esgotado</Badge>
              )}
            </div>
            
            <h3 style={{ color: '#ff4db2', fontWeight: 'bold', fontSize: '32px' }}>
              R$ {product.price?.toFixed(2)}
            </h3>
            
            <div className="mt-3">
              <h5>Descrição:</h5>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {product.description || "Action figure colecionável de alta qualidade. Produto oficial licenciado."}
              </p>
            </div>

            <div className="mt-4">
              <div className="d-flex gap-2 mb-3" style={{ fontSize: '14px', color: '#666' }}>
                <div className="d-flex align-items-center">
                  <span style={{ color: '#00f5d4', marginRight: '5px' }}>✓</span>
                  Frete grátis acima de R$ 200
                </div>
                <div className="d-flex align-items-center">
                  <span style={{ color: '#00f5d4', marginRight: '5px' }}>✓</span>
                  Pagamento seguro
                </div>
              </div>
              
              {product.stock > 0 && product.stock < 5 && (
                <div className="alert alert-warning" style={{ fontSize: '14px' }}>
                  ⚠️ Apenas {product.stock} unidades disponíveis!
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ borderTop: '2px solid #f0f0f0' }}>
        <Button variant="outline-secondary" onClick={onHide}>
          Fechar
        </Button>
        {product.stock > 0 && onAddToCart && (
          <Button 
            variant="primary" 
            onClick={() => {
              onAddToCart(product);
              onHide();
            }}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            <FaShoppingCart className="me-2" />
            Adicionar ao Carrinho
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
