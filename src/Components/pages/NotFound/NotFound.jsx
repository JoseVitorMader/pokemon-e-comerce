import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-content">
          <div className="notfound-icon-wrapper">
            <FaExclamationTriangle className="notfound-warning-icon" />
          </div>
          
          <img 
            src="/images/DigitamaLogo.png" 
            alt="Digitama" 
            className="notfound-logo" 
          />
          
          <h1 className="notfound-title">Oops!</h1>
          <h2 className="notfound-subtitle">Essa página não existe</h2>
          
          <p className="notfound-message">
            Parece que você se perdeu no mundo digital. 
            A página que você está procurando não foi encontrada.
          </p>

          <div className="notfound-error-code">
            Erro <span className="error-number">404</span>
          </div>

          <div className="notfound-actions">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/')}
              className="notfound-btn"
            >
              <FaHome /> Voltar para Home
            </Button>
            
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={() => navigate(-1)}
              className="notfound-btn-secondary"
            >
              Voltar à página anterior
            </Button>
          </div>

          <div className="notfound-help">
            <p>Precisa de ajuda? <a href="/">Explore nossos produtos</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
