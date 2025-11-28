import { createContext, useContext, useEffect, useState } from "react"; 
import { auth, googleProvider } from "../firebase";

import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // dados do usuário logado
  const [loading, setLoading] = useState(true); // controla carregamento inicial

  // Observa mudanças de autenticação (login/logout)
  useEffect(() => {
	const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
	  setUser(currentUser);
	  setLoading(false);
	});

	// limpa o listener quando o componente desmonta
	return () => unsubscribe();
  }, []);

  // Login com Google
  const loginWithGoogle = async () => {
	try {
	  const result = await signInWithPopup(auth, googleProvider);
	  console.log("Usuário Google:", result.user);
	} catch (error) {
	  console.error("Erro login Google:", error);
	  alert("Erro ao entrar com Google: " + error.code);
	}
  };

  // Logout
  const logout = async () => {
	try {
	  await signOut(auth);
	} catch (error) {
	  console.error("Erro ao sair:", error);
	}
  };

  return (
	<AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
	  {!loading && children}
	</AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);