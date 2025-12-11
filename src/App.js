import React from "react";
import "./styles.css";
import Header from "./Components/layout/Header/Header";
import Navigation from "./Components/layout/Navigation/Navigation";
import Footer from "./Components/layout/Footer/Footer";
import DigitalBackground from "./Components/common/DigitalBackground/DigitalBackground";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
        <BrowserRouter>
          <div className="App">
            <DigitalBackground />
            <Header />
            <Navigation />

            <main style={{ padding: "1rem" }}>
              <AppRoutes />
            </main>

            <Footer />
          </div>
        </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
