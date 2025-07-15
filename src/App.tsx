import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useProductStore } from './stores/productStore';
import { TableData } from './types';

// Components
import PublicHeader from './components/PublicHeader';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import DataPage from './pages/DataPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderHistory from './components/OrderHistory';

function App() {
  const { products, addProducts, fetchProducts } = useProductStore();
  const { user, isAuthenticated } = useAuthStore();

  // Fetch products on app load if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts]);

  const handleDataParsed = (data: TableData[]) => {
    addProducts(data);
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/data');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Conditional Header */}
        {user?.role === 'admin' && isAdminRoute ? (
          <Navigation />
        ) : (
          <PublicHeader />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/product/:id" element={<ProductDetailPage products={products} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected User Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute requiredRole="user">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={<CartPage />} 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="user">
                <OrderHistory />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage onDataParsed={handleDataParsed} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/data" 
            element={
              <ProtectedRoute requiredRole="admin">
                <DataPage data={products} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;