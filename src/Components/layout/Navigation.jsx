import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navigation() {
  const { user } = useAuth();

  return (
    <nav className="navigation">
      <Link to="/">Início</Link>
      <Link to="/cart">🛒 Carrinho</Link>
      {user && <Link to="/manage">⚙️ Meus Produtos</Link>}
      <Link to="/profile">Perfil</Link>
      {!user && <Link to="/login">Login</Link>}
    </nav>
  );
}

export default Navigation;
