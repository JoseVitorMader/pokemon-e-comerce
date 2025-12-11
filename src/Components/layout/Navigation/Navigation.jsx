import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaCog } from "react-icons/fa";

function Navigation() {
  const { user } = useAuth();

  return (
    <Nav className="navigation">
      <Nav.Link as={Link} to="/">Início</Nav.Link>
      <Nav.Link as={Link} to="/cart"><FaShoppingCart /> Carrinho</Nav.Link>
      {user && <Nav.Link as={Link} to="/manage"><FaCog /> Meus Produtos</Nav.Link>}
      <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
      {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
    </Nav>
  );
}

export default Navigation;
