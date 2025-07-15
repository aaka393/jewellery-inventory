import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gem, ShoppingCart, User, LogIn, Package } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import Cart from './Cart';

const PublicHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Gem className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Jewelry Store</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/orders"
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    <Package className="h-5 w-5" />
                    <span className="text-sm">Orders</span>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  );
};

export default PublicHeader;