import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { Container, Row, Col, Button, Badge, Card, ListGroup, Form, InputGroup, ProgressBar } from "react-bootstrap";
import { FaShoppingCart, FaTrash, FaTruck, FaCheck, FaShoppingBag, FaHome, FaCog, FaTicketAlt, FaTimes, FaGlassCheers, FaLock, FaCreditCard } from "react-icons/fa";

export default function Cart() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);

  const shippingCost = total >= 200 ? 0 : 15;
  const discount = appliedCoupon ? (total * appliedCoupon.percent) / 100 : 0;
  const finalTotal = total - discount + shippingCost;

  // Cupons de desconto simulados
  const coupons = {
    "DIGIMON10": { percent: 10, description: "10% de desconto" },
    "PRIMEIRACOMPRA": { percent: 15, description: "15% primeira compra" },
    "FRETEGRATIS": { percent: 0, freeShipping: true, description: "Frete grátis" }
  };

  function handleApplyCoupon() {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ ...coupon, code: couponCode.toUpperCase() });
      showToast(`Cupom "${couponCode.toUpperCase()}" aplicado!`, { type: 'success' });
    } else {
      showToast('Cupom inválido', { type: 'warning' });
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    showToast('Cupom removido', { type: 'info' });
  }

  function handleClearCart() {
    if (window.confirm("Deseja esvaziar o carrinho?")) {
      clearCart();
      showToast('Carrinho esvaziado', { type: 'info' });
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const progressToFreeShipping = total >= 200 ? 100 : (total / 200) * 100;
  const remainingForFreeShipping = Math.max(0, 200 - total);

  return (
    <Container className="cart-page">
      <div className="cart-header">
        <div>
          <h2><FaShoppingCart /> Meu Carrinho</h2>
          <p className="cart-subtitle">{totalItems} {totalItems === 1 ? 'produto' : 'produtos'} no carrinho</p>
        </div>
        {cart.length > 0 && (
          <Button variant="outline-danger" onClick={handleClearCart}>
            <FaTrash /> Limpar Carrinho
          </Button>
        )}
      </div>

      {/* Barra de progresso para frete grátis */}
      {cart.length > 0 && total < 200 && (
        <Card className="mb-3 free-shipping-banner">
          <Card.Body>
            <div className="d-flex align-items-center gap-2">
              <span className="banner-icon"><FaTruck /></span>
              <div className="flex-grow-1">
                <strong>Faltam R$ {remainingForFreeShipping.toFixed(2)} para frete grátis!</strong>
                <ProgressBar now={progressToFreeShipping} className="mt-2" style={{ height: '8px' }} />
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {total >= 200 && cart.length > 0 && (
        <Card bg="success" text="white" className="mb-3">
          <Card.Body className="d-flex align-items-center gap-2">
            <span><FaCheck /></span>
            <strong>Parabéns! Você ganhou frete grátis!</strong>
          </Card.Body>
        </Card>
      )}
      
      {cart.length === 0 ? (
        <div className="empty-cart-box">
          <div className="empty-icon"><FaShoppingBag size={60} /></div>
          <h3>Seu carrinho está vazio</h3>
          <p>Explore nossos produtos e adicione seus favoritos!</p>
          <div className="empty-cart-actions">
            <Button as={Link} to="/" variant="primary"><FaHome /> Ir às Compras</Button>
            <Button as={Link} to="/manage" variant="outline-secondary"><FaCog /> Meus Produtos</Button>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            <div className="cart-list-header">
              <h3>Produtos</h3>
              <span className="item-count-badge">{cart.length}</span>
            </div>
            
            {cart.map((it, index) => (
              <div key={it.id} className="cart-item-shopee" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="item-number">{index + 1}</div>
                <img src={it.image || "https://via.placeholder.com/100"} alt={it.name} />
                <div className="cart-item-info">
                  <h4>{it.name}</h4>
                  <div className="cart-item-details">
                    <span className="cart-item-price">R$ {it.price?.toFixed ? it.price.toFixed(2) : it.price}</span>
                    {it.stock !== undefined && (
                      <span className={`stock-indicator ${it.stock > 10 ? 'ok' : it.stock > 0 ? 'low' : 'out'}`}>
                        {it.stock > 0 ? `${it.stock} disponíveis` : 'Esgotado'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))}
                      disabled={it.qty <= 1}
                    >
                      -
                    </button>
                    <span className="qty-display">{it.qty}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQty(it.id, it.qty + 1)}
                      disabled={it.stock !== undefined && it.qty >= it.stock}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-value">R$ {(it.price * it.qty).toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn-remove" 
                    onClick={() => { 
                      removeItem(it.id); 
                      showToast('Item removido do carrinho', { type: 'warning' }); 
                    }}
                    title="Remover item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            {/* Botão continuar comprando */}
            <div className="continue-shopping">
              <Link to="/" className="continue-link">
                ← Continuar Comprando
              </Link>
            </div>
          </div>

          <div className="cart-summary-box">
            <h3 className="summary-title">Resumo do Pedido</h3>
            
            {/* Cupom de desconto */}
            <div className="coupon-section">
              <button 
                className="coupon-toggle" 
                onClick={() => setShowCoupon(!showCoupon)}
              >
                <FaTicketAlt /> {showCoupon ? 'Ocultar' : 'Tenho um cupom'}
              </button>
              
              {showCoupon && (
                <div className="coupon-input-container">
                  {!appliedCoupon ? (
                    <>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Digite o cupom"
                        className="coupon-input"
                      />
                      <button 
                        className="btn-apply-coupon" 
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                      >
                        Aplicar
                      </button>
                    </>
                  ) : (
                    <div className="applied-coupon">
                      <div className="coupon-info">
                        <span className="coupon-icon"><FaCheck /></span>
                        <div>
                          <strong>{appliedCoupon.code}</strong>
                          <p>{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>
                        <FaTimes />
                      </button>
                    </div>
                  )}
                  <div className="coupon-suggestions">
                    <small>Experimente: DIGIMON10, PRIMEIRACOMPRA</small>
                  </div>
                </div>
              )}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
              <span className="summary-value">R$ {total.toFixed(2)}</span>
            </div>
            
            {appliedCoupon && appliedCoupon.percent > 0 && (
              <div className="summary-row discount">
                <span>Desconto ({appliedCoupon.percent}%)</span>
                <span className="summary-value discount-value">- R$ {discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row shipping">
              <span>Frete</span>
              <span className={`summary-value ${(total >= 200 || (appliedCoupon?.freeShipping)) ? 'free' : ''}`}>
                {(total >= 200 || (appliedCoupon?.freeShipping)) ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-value">R$ {finalTotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="savings-badge">
                <FaGlassCheers /> Você economizou R$ {discount.toFixed(2)}
              </div>
            )}

            <button className="btn btn-checkout" onClick={() => navigate("/checkout")}>
              Finalizar Compra
            </button>

            <div className="cart-benefits">
              <div className="benefit-item"><FaLock /> Compra 100% Segura</div>
              <div className="benefit-item">↩️ Devolução em 7 dias</div>
              <div className="benefit-item"><FaCreditCard /> Parcele em até 12x</div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
