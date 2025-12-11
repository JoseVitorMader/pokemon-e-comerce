import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchUserProfile, saveUserProfile, getUserProducts } from "../../../firebase";
import { useToast } from "../../../context/ToastContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Badge, Image, Spinner } from "react-bootstrap";
import { FaUser, FaCheck, FaBox, FaChartBar, FaStore, FaCog, FaHome, FaEnvelope, FaMobileAlt, FaFileAlt, FaMapMarkerAlt, FaCity, FaMap, FaSave } from "react-icons/fa";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ 
    displayName: "", 
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: ""
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        setProfile({ displayName: "", email: "", phone: "", bio: "", address: "", city: "", state: "" });
        setLoading(false);
        return;
      }
      
      const data = await fetchUserProfile(user.uid);
      const userProducts = await getUserProducts(user.uid);
      
      if (mounted) {
        setProfile({ 
          displayName: data?.displayName || user.displayName || "", 
          email: data?.email || user.email || "",
          phone: data?.phone || "",
          bio: data?.bio || "",
          address: data?.address || "",
          city: data?.city || "",
          state: data?.state || ""
        });
        setProducts(userProducts);
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user) {
      showToast("Faça login para salvar o perfil", { type: 'warning' });
      return;
    }
    setSaving(true);
    try {
      await saveUserProfile(user.uid, profile);
      showToast("Perfil salvo com sucesso", { type: 'success' });
    } catch (error) {
      showToast("Erro ao salvar perfil", { type: 'warning' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <span className="spinner"></span>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-not-logged">
          <div className="empty-icon"><FaUser size={60} /></div>
          <h2>Acesso Restrito</h2>
          <p>Faça login para acessar seu perfil</p>
          <Link to="/login" className="btn">Fazer Login</Link>
        </div>
      </div>
    );
  }

  const initials = user.displayName 
    ? user.displayName.split(' ').map(n=>n[0]).slice(0,2).join('') 
    : user.email[0].toUpperCase();

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Sidebar com informações do usuário */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-large profile-initials-large">{initials}</div>
            )}
            <h2 className="profile-name">{profile.displayName || "Usuário"}</h2>
            <p className="profile-email">{profile.email}</p>
            <div className="profile-badge">
              <span className="badge-icon"><FaCheck /></span>
              Conta Verificada
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-icon"><FaBox /></div>
              <div className="stat-info">
                <div className="stat-number">{products.length}</div>
                <div className="stat-text">Produtos</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><FaChartBar /></div>
              <div className="stat-info">
                <div className="stat-number">{totalStock}</div>
                <div className="stat-text">Estoque Total</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon"><FaStore /></div>
              <div className="stat-info">
                <div className="stat-number">{products.filter(p => p.stock > 0).length}</div>
                <div className="stat-text">Disponíveis</div>
              </div>
            </div>
          </div>

          <div className="profile-quick-actions">
            <Link to="/manage" className="quick-action-btn">
              <span className="action-icon"><FaCog /></span>
              Gerenciar Produtos
            </Link>
            <Link to="/" className="quick-action-btn">
              <span className="action-icon"><FaHome /></span>
              Ir para Loja
            </Link>
          </div>
        </div>

        {/* Formulário de edição do perfil */}
        <div className="profile-main">
          <div className="profile-section">
            <div className="section-title">
              <h3><FaUser /> Informações Pessoais</h3>
              <p className="section-subtitle">Gerencie suas informações de perfil</p>
            </div>

            <form className="profile-edit-form" onSubmit={handleSave}>
              <div className="form-grid-profile">
                <div className="form-group-profile">
                  <label>
                    <span className="label-icon"><FaUser /></span>
                    Nome Completo
                  </label>
                  <input 
                    type="text"
                    value={profile.displayName} 
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} 
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="form-group-profile">
                  <label>
                    <span className="label-icon"><FaEnvelope /></span>
                    Email
                  </label>
                  <input 
                    type="email"
                    value={profile.email} 
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group-profile">
                  <label>
                    <span className="label-icon"><FaMobileAlt /></span>
                    Telefone
                  </label>
                  <input 
                    type="tel"
                    value={profile.phone} 
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group-profile full-width">
                  <label>
                    <span className="label-icon"><FaFileAlt /></span>
                    Bio
                  </label>
                  <textarea 
                    value={profile.bio} 
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="section-divider"></div>

              <div className="section-title">
                <h3><FaMapMarkerAlt /> Endereço</h3>
                <p className="section-subtitle">Informações de entrega</p>
              </div>

              <div className="form-grid-profile">
                <div className="form-group-profile full-width">
                  <label>
                    <span className="label-icon"><FaHome /></span>
                    Endereço Completo
                  </label>
                  <input 
                    type="text"
                    value={profile.address} 
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                    placeholder="Rua, número, complemento, bairro"
                  />
                </div>

                <div className="form-group-profile">
                  <label>
                    <span className="label-icon"><FaCity /></span>
                    Cidade
                  </label>
                  <input 
                    type="text"
                    value={profile.city} 
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })} 
                    placeholder="Sua cidade"
                  />
                </div>

                <div className="form-group-profile">
                  <label>
                    <span className="label-icon"><FaMap /></span>
                    Estado
                  </label>
                  <input 
                    type="text"
                    value={profile.state} 
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })} 
                    placeholder="UF"
                    maxLength="2"
                  />
                </div>
              </div>

              <div className="form-actions-profile">
                <button type="submit" className="btn btn-save-profile" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave /> Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Seção de Produtos Recentes */}
          {products.length > 0 && (
            <div className="profile-section">
              <div className="section-title">
                <h3><FaBox /> Seus Produtos Recentes</h3>
                <Link to="/manage" className="view-all-link">Ver todos →</Link>
              </div>

              <div>
                {products.slice(0, 3).map((product) => (
                  <Card key={product.id} className="mb-3" style={{ maxWidth: '100%' }}>
                    <Row className="g-0">
                      <Col md={4} sm={5} xs={12}>
                        <Card.Img 
                          src={product.image || "https://via.placeholder.com/150"} 
                          alt={product.name}
                          style={{ height: '150px', objectFit: 'cover', borderRadius: '8px 0 0 8px' }}
                        />
                      </Col>
                      <Col md={8} sm={7} xs={12}>
                        <Card.Body>
                          <Card.Title style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>
                            {product.name}
                          </Card.Title>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Badge bg="primary" style={{ fontSize: '13px', padding: '4px 8px' }}>
                              R$ {product.price?.toFixed(2)}
                            </Badge>
                            <Badge bg={product.stock === 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'} style={{ fontSize: '13px', padding: '4px 8px' }}>
                              {product.stock || 0} em estoque
                            </Badge>
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
