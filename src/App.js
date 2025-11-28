import React from "react";
import "./styles.css";
import Header from "./Components/Header";
import Navigation from "./Components/Navigation";
import DigitalBackground from "./Components/DigitalBackground";
import Footer from "./Components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import ProductsPage from "./Components/ProductsPage";
import ProductPage from "./Components/ProductPage";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import ProfilePage from "./Components/ProfilePage";
import LoginPage from "./Components/LoginPage";
import ManageProducts from "./Components/ManageProducts";
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
