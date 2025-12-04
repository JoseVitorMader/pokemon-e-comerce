import React, { useEffect, useState } from "react";
import { subscribeProducts } from "../../firebase";
import { Link } from "react-router-dom";
import { Form, Badge, Button, Card, Row, Col, ButtonGroup } from "react-bootstrap";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [viewMode, setViewMode] = useState("grid"); // grid ou list

  useEffect(() => {
    const unsubscribe = subscribeProducts((list) => setProducts(list));
    return () => unsubscribe && unsubscribe();
  }, []);

  const categories = ["Todos", "Action Figure", "Estátua", "Miniatura", "Deluxe", "Limitado"];

  const filtered = selectedCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div style={{ padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎮 Action Figures de Digimon</h2>
        <ButtonGroup>
          <Button 
            variant={viewMode === "grid" ? "primary" : "outline-primary"} 
            onClick={() => setViewMode("grid")}
          >
            ⊞ Grid
          </Button>
          <Button 
            variant={viewMode === "list" ? "primary" : "outline-primary"} 
            onClick={() => setViewMode("list")}
          >
            ☰ Lista
          </Button>
        </ButtonGroup>
      </div>

      {/* Filtro de Categorias */}
      <div className="mb-4">
        <ButtonGroup className="flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "primary" : "outline-primary"}
              onClick={() => setSelectedCategory(cat)}
              className="mb-2"
            >
              {cat} {selectedCategory === cat && `(${filtered.length})`}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Lista de Produtos */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <h4>😕 Nenhum produto encontrado</h4>
          <p className="text-muted">Não há produtos nesta categoria no momento.</p>
        </div>
      ) : viewMode === "grid" ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filtered.map((p) => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm" style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative' }}>
                  <Card.Img 
                    variant="top" 
                    src={p.image || "https://via.placeholder.com/200"} 
                    alt={p.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {p.category && (
                    <Badge bg="dark" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      {p.category}
                    </Badge>
                  )}
                  {p.stock !== undefined && p.stock === 0 && (
                    <Badge bg="danger" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      Esgotado
                    </Badge>
                  )}
                  {p.stock > 0 && p.stock < 5 && (
                    <Badge bg="warning" style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      Últimas unidades
                    </Badge>
                  )}
                </div>
                <Card.Body>
                  <Card.Title style={{ fontSize: '16px', fontWeight: 'bold' }}>{p.name}</Card.Title>
                  <Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4db2' }}>
                        R$ {p.price?.toFixed(2)}
                      </span>
                      {p.stock > 0 && (
                        <Badge bg="success" pill>{p.stock} em estoque</Badge>
                      )}
                    </div>
                  </Card.Text>
                  <Link to={`/product/${p.id}`} className="btn btn-primary w-100">
                    Ver Detalhes
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((p) => (
            <Card key={p.id} className="shadow-sm">
              <Row className="g-0">
                <Col md={3}>
                  <Card.Img 
                    src={p.image || "https://via.placeholder.com/200"} 
                    alt={p.name}
                    style={{ height: '100%', objectFit: 'cover', maxHeight: '200px' }}
                  />
                </Col>
                <Col md={9}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{p.name}</Card.Title>
                        {p.category && <Badge bg="secondary" className="mb-2">{p.category}</Badge>}
                        <Card.Text className="text-muted">
                          {p.description || "Action figure colecionável de alta qualidade"}
                        </Card.Text>
                      </div>
                      <div className="text-end">
                        <h4 style={{ color: '#ff4db2', fontWeight: 'bold' }}>
                          R$ {p.price?.toFixed(2)}
                        </h4>
                        {p.stock > 0 ? (
                          <Badge bg="success" pill>{p.stock} em estoque</Badge>
                        ) : (
                          <Badge bg="danger" pill>Esgotado</Badge>
                        )}
                      </div>
                    </div>
                    <Link to={`/product/${p.id}`} className="btn btn-primary mt-3">
                      Ver Detalhes →
                    </Link>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
