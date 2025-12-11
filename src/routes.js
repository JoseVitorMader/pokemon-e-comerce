import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './Components/pages/Home/Home';
import ProductsPage from './Components/pages/ProductsPage/ProductsPage';
import ProductPage from './Components/pages/ProductPage/ProductPage';
import Cart from './Components/pages/Cart/Cart';
import Checkout from './Components/pages/Checkout/Checkout';
import ProfilePage from './Components/pages/ProfilePage/ProfilePage';
import LoginPage from './Components/pages/LoginPage/LoginPage';
import ManageProducts from './Components/pages/ManageProducts/ManageProducts';
import NotFound from './Components/pages/NotFound/NotFound';

// Componente para proteger rotas privadas
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rotas protegidas - requerem autenticação */}
      <Route 
        path="/checkout" 
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/manage" 
        element={
          <PrivateRoute>
            <ManageProducts />
          </PrivateRoute>
        } 
      />
      
      {/* Página de erro 404 - deve ser a última rota */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
