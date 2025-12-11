import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { FaGoogle, FaShieldAlt, FaTruck, FaHeart, FaStar, FaAward, FaBolt, FaHome, FaShoppingBag, FaCog, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

export default function LoginPage() {
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="login-page-wrapper">
      <Container className="login-container-wrapper">
        {user ? (
          // Estado logado
          <div className="login-card-modern logged-in">
            <div className="card-glow"></div>
            
            <div className="login-content">
              <div className="user-section">
                <div className="user-avatar-container">
                  <div className="avatar-glow"></div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="user-avatar-img" />
                  ) : (
                    <div className="avatar-placeholder-modern">
                      {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="verified-badge-floating">
                    <FaCheckCircle />
                  </div>
                </div>

                <div className="user-info-modern">
                  <h2 className="user-name">{user.displayName || "Usuário"}</h2>
                  <p className="user-email-modern">{user.email}</p>
                  <Badge className="status-badge">
                    <FaCheckCircle /> Conta Verificada
                  </Badge>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <FaShoppingBag className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Compras</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <FaHeart className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Favoritos</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <FaStar className="stat-icon" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reviews</div>
                  </div>
                </div>
              </div>

              <div className="action-buttons-grid">
                <Button 
                  className="action-btn-modern primary"
                  onClick={() => navigate('/')}
                >
                  <FaHome />
                  <span>Home</span>
                </Button>
                <Button 
                  className="action-btn-modern secondary"
                  onClick={() => navigate('/products')}
                >
                  <FaShoppingBag />
                  <span>Produtos</span>
                </Button>
                <Button 
                  className="action-btn-modern secondary"
                  onClick={() => navigate('/profile')}
                >
                  <FaCog />
                  <span>Perfil</span>
                </Button>
                <Button 
                  className="action-btn-modern danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Sair</span>
                </Button>
              </div>

              <div className="welcome-message">
                <p>🎮 Bem-vindo de volta! Continue explorando o mundo digital.</p>
              </div>
            </div>
          </div>
        ) : (
          // Estado não logado
          <div className="login-card-modern">
            <div className="card-glow"></div>
            
            <div className="login-content">
              <div className="login-header-modern">
                <div className="logo-container-animated">
                  <img src="/images/DigitamaLogo.png" alt="Digitama" className="login-logo-modern" />
                  <div className="logo-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <h1 className="login-title-modern">Entre na Digitama</h1>
                <p className="login-subtitle-modern">Sua jornada digital começa aqui</p>
              </div>

              <Button 
                className="google-btn-modern"
                onClick={loginWithGoogle}
              >
                <div className="btn-icon-wrapper">
                  <FaGoogle />
                </div>
                <span>Continuar com Google</span>
                <div className="btn-shine"></div>
              </Button>

              <div className="divider-modern">
                <span>Por que escolher a Digitama?</span>
              </div>

              <div className="benefits-grid-modern">
                <div className="benefit-card-modern">
                  <div className="benefit-icon-container">
                    <FaTruck />
                  </div>
                  <div className="benefit-content">
                    <h4>Frete Grátis</h4>
                    <p>Acima de R$ 200</p>
                  </div>
                </div>

                <div className="benefit-card-modern">
                  <div className="benefit-icon-container">
                    <FaShieldAlt />
                  </div>
                  <div className="benefit-content">
                    <h4>Compra Segura</h4>
                    <p>100% protegida</p>
                  </div>
                </div>

                <div className="benefit-card-modern">
                  <div className="benefit-icon-container">
                    <FaAward />
                  </div>
                  <div className="benefit-content">
                    <h4>Originais</h4>
                    <p>Produtos oficiais</p>
                  </div>
                </div>

                <div className="benefit-card-modern">
                  <div className="benefit-icon-container">
                    <FaBolt />
                  </div>
                  <div className="benefit-content">
                    <h4>Entrega Rápida</h4>
                    <p>Até 7 dias úteis</p>
                  </div>
                </div>
              </div>

              <div className="community-badge-modern">
                <div className="community-icon-wrapper">
                  <FaStar />
                </div>
                <div className="community-text">
                  <strong>+10.000 colecionadores</strong>
                  <p>Junte-se à maior comunidade de fãs de Digimon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
