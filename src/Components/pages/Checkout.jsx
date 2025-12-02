import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

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

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setProcessing(true);
    
    // Mock payment processing
    await new Promise((r) => setTimeout(r, 2000));
    
    clearCart();
    setProcessing(false);
    showToast("🎉 Pedido realizado com sucesso!", { type: 'success' });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <div className="empty-icon">📦</div>
          <h3>Nenhum item para finalizar</h3>
          <p>Adicione produtos ao carrinho antes de finalizar a compra</p>
          <button className="btn" onClick={() => navigate("/")}>Ver Produtos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">🛍️ Finalizar Compra</h2>
      
      <div className="checkout-container">
        <div className="checkout-main">
          {/* Endereço de Entrega */}
          <div className="checkout-section">
            <div className="section-header">
              <span className="section-icon">📍</span>
              <h3>Endereço de Entrega</h3>
            </div>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Nome Completo *</label>
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="João Silva"
                    required 
                  />
                </div>
                <div className="form-field">
                  <label>Telefone *</label>
                  <input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="(11) 99999-9999"
                    required 
                  />
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-field">
                  <label>CEP *</label>
                  <input 
                    value={cep} 
                    onChange={(e) => setCep(e.target.value)} 
                    placeholder="00000-000"
                    maxLength="9"
                    required 
                  />
                </div>
                <div className="form-field full-width">
                  <label>Endereço Completo *</label>
                  <input 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Rua, número, complemento, bairro, cidade - UF"
                    required 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Método de Pagamento */}
          <div className="checkout-section">
            <div className="section-header">
              <span className="section-icon">💳</span>
              <h3>Método de Pagamento</h3>
            </div>
            
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
                <span className="payment-icon">💳</span>
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
                <span className="payment-icon">📱</span>
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
                <span className="payment-icon">📄</span>
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
                <p>📱 Após confirmar o pedido, você receberá o QR Code para pagamento via PIX</p>
                <div className="pix-benefits">
                  <span>✓ Aprovação instantânea</span>
                  <span>✓ Sem taxas</span>
                  <span>✓ Disponível 24h</span>
                </div>
              </div>
            )}

            {paymentMethod === 'boleto' && (
              <div className="boleto-info">
                <p>📄 O boleto será gerado após a confirmação do pedido</p>
                <div className="boleto-warning">
                  ⚠️ O pedido será processado somente após a confirmação do pagamento (até 3 dias úteis)
                </div>
              </div>
            )}
          </div>
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
              <div className="badge-item">🔒 Compra Segura</div>
              <div className="badge-item">✓ Dados Protegidos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
