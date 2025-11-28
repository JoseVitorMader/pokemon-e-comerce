import React from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <div className="login-page">
      <h2>Login</h2>
      {user ? (
        <div className="logged-in">
          <p>Logado como <strong>{user.displayName || user.email}</strong></p>
          <button className="btn logout-btn" onClick={logout}>Sair</button>
        </div>
      ) : (
        <div className="login-actions">
          <button className="btn auth-btn" onClick={loginWithGoogle}>Entrar com Google</button>
        </div>
      )}
    </div>
  );
}
