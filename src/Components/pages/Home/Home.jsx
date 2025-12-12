import React, { useEffect, useState, useMemo } from "react";
import { subscribeProducts } from "../../../firebase";
import { Link } from "react-router-dom";
import { Carousel, Form, Badge, ButtonGroup, Button } from "react-bootstrap";
import QuickViewModal from "../../common/QuickViewModal/QuickViewModal";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { GiEasterEgg } from "react-icons/gi";
import { SiDigikeyelectronics } from "react-icons/si";
import { FaSearch, FaTimes, FaSadTear, FaCheck } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState("Todos");
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeProducts((list) => setProducts(list));
    return () => unsubscribe && unsubscribe();
  }, []);


  const categories = ["Todos", "Action Figure", "Estátua", "Miniatura", "Deluxe", "Limitado"];


  let filtered = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === "Até R$ 50") matchesPrice = p.price <= 50;
    else if (priceRange === "R$ 50 - R$ 100") matchesPrice = p.price > 50 && p.price <= 100;
    else if (priceRange === "R$ 100 - R$ 200") matchesPrice = p.price > 100 && p.price <= 200;
    else if (priceRange === "Acima de R$ 200") matchesPrice = p.price > 200;

    return matchesSearch && matchesCategory && matchesPrice;
  });


  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));


  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const copy = [...products];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, 3);
  }, [products]);

  const handleAddToCart = (product) => {
    addItem(product);
    showToast(`${product.name} adicionado ao carrinho!`, { type: 'success' });
  };

  const handleQuickView = (e, product) => {
    e.preventDefault();
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  return (
    <div>
      <section className="hero-banner">
        <div className="banner-content">
          <div className="banner-tag">NOVA COLEÇÃO</div>
          <h1><img src="/images/DigitamaLogo.png" alt="Digitama" style={{ height: '60px', marginRight: '15px', verticalAlign: 'middle' }} /> Digitama</h1>
          <p>Colecionáveis oficiais com entrega rápida • Frete Grátis acima de R$ 200 !</p>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <Carousel className="mb-4 digimon-carousel" interval={3000}>
          {featuredProducts.map((product, index) => (
            <Carousel.Item key={product.id}>
              <div style={{
                height: '450px',
                background: `linear-gradient(135deg, 
                  ${index % 3 === 0 ? '#0a1628 0%, #132a46 50%, #1a4063 100%' : 
                    index % 3 === 1 ? '#1a1a2e 0%, #16213e 50%, #0f3460 100%' : 
                    '#0d1b2a 0%, #1b263b 50%, #415a77 100%'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(0, 245, 212, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 245, 212, 0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                  opacity: 0.5
                }}></div>

                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #00f5d4, transparent)',
                  animation: 'scanline 3s linear infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '30%',
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ff4db2, transparent)',
                  animation: 'scanline 4s linear infinite reverse'
                }}></div>

                <div style={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0, 245, 212, 0.2), transparent)',
                  filter: 'blur(40px)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '10%',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 77, 178, 0.2), transparent)',
                  filter: 'blur(40px)',
                  animation: 'pulse 4s ease-in-out infinite'
                }}></div>

                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>

                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    border: '2px solid rgba(0, 245, 212, 0.3)',
                    borderRadius: '10px',
                    zIndex: -1
                  }}></div>
                  
                  <img
                    src={product.image || "https://via.placeholder.com/400"}
                    alt={product.name}
                    style={{
                      maxHeight: '350px',
                      maxWidth: '90%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 30px rgba(0, 245, 212, 0.4))',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(transparent 50%, rgba(0, 245, 212, 0.03) 50%)',
                    backgroundSize: '100% 4px',
                    pointerEvents: 'none'
                  }}></div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '5%',
                  transform: 'translateY(-50%)',
                  fontSize: '10px',
                  color: 'rgba(0, 245, 212, 0.3)',
                  fontFamily: 'monospace',
                  lineHeight: '1.8',
                  textShadow: '0 0 10px rgba(0, 245, 212, 0.5)'
                }}>
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i}>{'> ' + Math.random().toString(36).substring(2, 15)}</div>
                  ))}
                </div>
              </div>
              
              <Carousel.Caption style={{ 
                background: 'linear-gradient(to top, rgba(10, 22, 40, 0.95), transparent)',
                borderRadius: '0',
                padding: '30px 15px 20px',
                bottom: 0,
                left: 0,
                right: 0
              }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <Badge 
                    bg="dark" 
                    style={{ 
                      background: 'rgba(0, 245, 212, 0.2)',
                      border: '1px solid #00f5d4',
                      color: '#00f5d4',
                      marginBottom: '10px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >

                  </Badge>
                  <h3 style={{ 
                    fontWeight: 'bold',
                    fontSize: '28px',
                    textShadow: '0 0 20px rgba(0, 245, 212, 0.5)',
                    marginBottom: '10px'
                  }}>
                    {product.name}
                  </h3>
                  <div style={{ 
                    fontSize: '24px',
                    color: '#ff4db2',
                    fontWeight: 'bold',
                    textShadow: '0 0 15px rgba(255, 77, 178, 0.5)',
                    marginBottom: '15px'
                  }}>
                    R$ {product.price?.toFixed(2)}
                  </div>
                  <Link 
                    to={`/product/${product.id}`} 
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #00f5d4 0%, #00d4aa 100%)',
                      border: 'none',
                      color: '#0a1628',
                      fontWeight: 'bold',
                      padding: '10px 30px',
                      borderRadius: '8px',
                      boxShadow: '0 0 20px rgba(0, 245, 212, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 0 30px rgba(0, 245, 212, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 0 20px rgba(0, 245, 212, 0.4)';
                    }}
                  >
                    Ver Produto →
                  </Link>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}



      <div className="filters-section" style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div className="search-bar mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
          />
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label><strong>Categoria</strong></Form.Label>
            <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Label><strong>Faixa de Preço</strong></Form.Label>
            <Form.Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="Todos">Todos os preços</option>
              <option value="Até R$ 50">Até R$ 50</option>
              <option value="R$ 50 - R$ 100">R$ 50 - R$ 100</option>
              <option value="R$ 100 - R$ 200">R$ 100 - R$ 200</option>
              <option value="Acima de R$ 200">Acima de R$ 200</option>
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Label><strong>Ordenar por</strong></Form.Label>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Padrão</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">Nome (A-Z)</option>
            </Form.Select>
          </div>
        </div>

        <div className="mt-3">
          {(selectedCategory !== "Todos" || priceRange !== "Todos" || search) && (
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <span style={{ fontSize: '14px', color: '#666' }}>Filtros ativos:</span>
              {selectedCategory !== "Todos" && (
                <Badge bg="primary" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory("Todos")}>
                  {selectedCategory} <FaTimes />
                </Badge>
              )}
              {priceRange !== "Todos" && (
                <Badge bg="success" style={{ cursor: 'pointer' }} onClick={() => setPriceRange("Todos")}>
                  {priceRange} <FaTimes />
                </Badge>
              )}
              {search && (
                <Badge bg="info" style={{ cursor: 'pointer' }} onClick={() => setSearch("")}>
                  Busca: "{search}" <FaTimes />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="products-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Todos os Produtos</h2>

        </div>
        <div className="grid">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px' }}>
              <h4><FaSadTear size={40} /> Nenhum produto encontrado</h4>
              <p>Tente ajustar os filtros ou fazer uma nova busca</p>
              <Button variant="primary" onClick={() => {
                setSearch("");
                setSelectedCategory("Todos");
                setPriceRange("Todos");
              }}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="product-card" style={{ position: 'relative' }}>
                <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <img src={p.image || "https://via.placeholder.com/200"} alt={p.name} />
                    {p.stock !== undefined && p.stock === 0 && (
                      <div className="badge badge-out">Esgotado</div>
                    )}
                    {p.stock > 0 && p.stock < 5 && (
                      <div className="badge badge-limited">Últimas unidades</div>
                    )}
                    {p.category && (
                      <Badge bg="dark" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px' }}>
                        {p.category}
                      </Badge>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{p.name}</h3>
                    <div className="product-price-row">
                      <div className="price-main">R$ {p.price?.toFixed ? p.price.toFixed(2) : p.price}</div>
                    </div>
                    {p.stock !== undefined && p.stock > 0 && (
                      <div className="product-stock"><FaCheck /> {p.stock} disponíveis</div>
                    )}
                  </div>
                </Link>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mt-2 w-100"
                  onClick={(e) => handleQuickView(e, p)}
                  style={{ fontSize: '12px' }}
                >
                 Visualização Rápida
                </Button>
              </div>
            ))
          )}
        </div>
      </section>

      <QuickViewModal 
        show={showQuickView}
        onHide={() => setShowQuickView(false)}
        product={quickViewProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
