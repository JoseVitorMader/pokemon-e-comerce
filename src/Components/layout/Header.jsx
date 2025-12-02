import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const { cart } = useCart();

  const initials = user ? (user.displayName ? user.displayName.split(' ').map(n=>n[0]).slice(0,2).join('') : (user.email ? user.email[0].toUpperCase() : 'U')) : '';
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="header">
      <h1 className="logo">Digimon Shop</h1>
      <div className="header-actions">
        <Link to="/cart" className="cart-icon-link">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {user ? (
          <div className="profile-inline">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || user.email} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-initials">{initials}</div>
            )}
            <span className="user-greeting">{user.displayName || user.email}</span>
            <button className="btn logout-btn" onClick={logout}>Sair</button>
          </div>
        ) : (
          <button className="btn auth-btn" onClick={loginWithGoogle}>Entrar com Google</button>
        )}
      </div>
    </header>
  );
};

export default Header;