import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { placeOrder, saveCartToDb } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { Container, Row, Col, Form, Button, Card, ListGroup, Badge, InputGroup } from "react-bootstrap";
import { FaParty, FaBox, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaMobileAlt, FaFileAlt, FaCheck, FaExclamationTriangle, FaLock } from "react-icons/fa";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const shippingCost = total >= 200 ? 0 : 15;
  const finalTotal = total + shippingCost;
  const { user } = useAuth();

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setProcessing(true);
    
    // Mock payment processing
    await new Promise((r) => setTimeout(r, 2000));
    
    try {
      if (!user) {
        showToast('Você precisa estar logado para finalizar a compra', { type: 'danger' });
        setProcessing(false);
        return;
      }

      const orderPayload = {
        name,
        address,
        phone,
        cep,
        paymentMethod,
        total,
        shippingCost,
        finalTotal
      };

      // Place order (will decrement stock atomically)
      const orderId = await placeOrder(user.uid, orderPayload, cart);

      // Save empty cart to DB (user's cart cleared after purchase)
      await saveCartToDb(user.uid, []);

      clearCart();
      showToast(`Pedido ${orderId} realizado com sucesso!`, { type: 'success' });
      setProcessing(false);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Erro ao processar pedido:', err);
      showToast(`Erro ao processar pedido: ${err.message || err}`, { type: 'danger' });
      setProcessing(false);
    }
  }

  if (cart.length === 0) {
    return (
      <Container className="checkout-page">
        <div className="empty-checkout">
          <div className="empty-icon"><FaBox size={60} /></div>
          <h3>Nenhum item para finalizar</h3>
          <p>Adicione produtos ao carrinho antes de finalizar a compra</p>
          <Button variant="primary" onClick={() => navigate("/")}>Ver Produtos</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="checkout-page">
      <h2 className="checkout-title"><FaShoppingBag /> Finalizar Compra</h2>
      
      <div className="checkout-container">
        <div className="checkout-main">{/* Endereço de Entrega */}
          <Card className="mb-4">
            <Card.Header>
              <span className="section-icon"><FaMapMarkerAlt /></span>
              <h3 className="d-inline ms-2">Endereço de Entrega</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePlaceOrder}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome Completo *</Form.Label>
                      <Form.Control 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="João Silva"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefone *</Form.Label>
                      <Form.Control 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="(11) 99999-9999"
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>CEP *</Form.Label>
                      <Form.Control 
                        value={cep} 
                        onChange={(e) => setCep(e.target.value)} 
                        placeholder="00000-000"
                        maxLength="9"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Endereço Completo *</Form.Label>
                      <Form.Control 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Rua, número, complemento, bairro, cidade - UF"
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Método de Pagamento */}
          <Card className="mb-4">
            <Card.Header>
              <span className="section-icon"><FaCreditCard /></span>
              <h3 className="d-inline ms-2">Método de Pagamento</h3>
            </Card.Header>
            <Card.Body>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${paymentMethod === 'credit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="credit" 
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                  />
                  <span className="payment-icon"><FaCreditCard /></span>
                  <div>
                    <strong>Cartão de Crédito</strong>
                    <p>Visa, Mastercard, Elo</p>
                  </div>
                </div>
                
                <div 
                  className={`payment-option ${paymentMethod === 'pix' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('pix')}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="pix" 
                    checked={paymentMethod === 'pix'}
                    onChange={() => setPaymentMethod('pix')}
                  />
                  <span className="payment-icon"><FaMobileAlt /></span>
                  <div>
                    <strong>PIX</strong>
                    <p>Aprovação imediata</p>
                  </div>
                </div>
                
                <div 
                  className={`payment-option ${paymentMethod === 'boleto' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('boleto')}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="boleto" 
                    checked={paymentMethod === 'boleto'}
                    onChange={() => setPaymentMethod('boleto')}
                  />
                  <span className="payment-icon"><FaFileAlt /></span>
                  <div>
                    <strong>Boleto</strong>
                    <p>Vencimento em 3 dias</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'credit' && (
                <div className="card-form">
                  <div className="form-field">
                    <label>Número do Cartão *</label>
                    <input 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)} 
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Nome no Cartão *</label>
                    <input 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)} 
                      placeholder="Nome como está no cartão"
                      required 
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Validade *</label>
                      <input 
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)} 
                        placeholder="MM/AA"
                        maxLength="5"
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label>CVV *</label>
                      <input 
                        value={cardCvv} 
                        onChange={(e) => setCardCvv(e.target.value)} 
                        placeholder="123"
                        maxLength="4"
                        type="password"
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="pix-info">
                  <p><FaMobileAlt /> Após confirmar o pedido, você receberá o QR Code para pagamento via PIX</p>
                  <div className="pix-benefits">
                    <span><FaCheck /> Aprovação instantânea</span>
                    <span><FaCheck /> Sem taxas</span>
                    <span><FaCheck /> Disponível 24h</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'boleto' && (
                <div className="boleto-info">
                  <p><FaFileAlt /> O boleto será gerado após a confirmação do pedido</p>
                  <div className="boleto-warning">
                    <FaExclamationTriangle /> O pedido será processado somente após a confirmação do pagamento (até 3 dias úteis)
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Resumo do Pedido */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Resumo do Pedido</h3>
            
            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image || "https://via.placeholder.com/60"} alt={item.name} />
                  <div className="summary-item-info">
                    <div className="summary-item-name">{item.name}</div>
                    <div className="summary-item-qty">Qtd: {item.qty}</div>
                  </div>
                  <div className="summary-item-price">R$ {(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Frete</span>
              <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                {shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">R$ {finalTotal.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-finalize" 
              onClick={handlePlaceOrder}
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner"></span>
                  Processando...
                </>
              ) : (
                'Finalizar Pedido'
              )}
            </button>

            <div className="security-badges">
              <div className="badge-item"><FaLock /> Compra Segura</div>
              <div className="badge-item"><FaCheck /> Dados Protegidos</div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
