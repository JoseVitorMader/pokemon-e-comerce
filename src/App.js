import React from "react";
import "./styles.css";
import { Header, Navigation, Footer } from "./Components/layout";
import { DigitalBackground } from "./Components/common";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  Home, 
  ProductsPage, 
  ProductPage, 
  Cart, 
  Checkout, 
  ProfilePage, 
  LoginPage, 
  ManageProducts 
} from "./Components/pages";
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/manage" element={<ManageProducts />} />
              </Routes>
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
