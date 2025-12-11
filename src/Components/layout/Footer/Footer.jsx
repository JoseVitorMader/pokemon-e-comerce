import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer footer-fixed">
      <Container className="footer-inner">
        <Row className="align-items-center">
          <Col md={6} className="footer-brand">
            <strong>Digimon Shop</strong>
            <div className="footer-sub">Colecione. Troque. Lute.</div>
          </Col>
          <Col md={6} className="footer-copy text-md-end">&copy; 2025 Digimon Shop. Todos os direitos reservados.</Col>
        </Row>
      </Container>
    </footer>
  );
}
export default Footer;
