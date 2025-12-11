import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function Error() {
  return (
    <div className="error-page">
      <Container className="error-container">
        <div className="error-content">
          <div className="error-icon-wrapper">
            <FaExclamationTriangle className="error-icon" />
          </div>
          
          <div className="error-logo">
            <img src="/images/DigitamaLogo.png" alt="Digitama" />
          </div>
          
          <h1 className="error-title">404</h1>
          <h2 className="error-subtitle">Ooops, essa página não existe!</h2>
          <p className="error-message">
            Parece que você se perdeu no mundo digital. A página que você está procurando não foi encontrada.
          </p>
          
          <div className="error-actions">
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              size="lg" 
              className="btn-home"
            >
              <FaHome /> Voltar para Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
