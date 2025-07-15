import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.-]+/g, '')) 
      : price;
    return `₹${numericPrice.toFixed(2)}`;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Discover our beautiful collection of handcrafted jewelry
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Jewelry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <p className="text-purple-100 text-sm mt-1">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {items.map((item) => {
                const image = item.image ?? item.images?.[0] ?? 'https://via.placeholder.com/80x80?text=No+Image';

                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    {/* Product Image */}
                    <img
                      src={image}
                      alt={item.description}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.description}
                      </h3>
                      {item.category && (
                        <p className="text-sm text-purple-600 capitalize mb-2">
                          {item.category}
                        </p>
                      )}
                      <p className="text-lg font-bold text-purple-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-lg">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-0">
                      <p className="font-bold text-lg text-gray-900">
                        {formatPrice(parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) * item.quantity)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-lg text-gray-600">
                    Total ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                  </p>
                  <p className="text-sm text-gray-500">
                    Free shipping on orders above ₹500
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{getTotalPrice().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  You'll be redirected to login before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;