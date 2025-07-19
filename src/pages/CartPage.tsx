import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import PaymentHandler from '../components/payment/PaymentHandler';

const CartPage: React.FC = () => {
  const { items, guestItems, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Use appropriate items based on auth status
  const currentItems = isAuthenticated ? items : guestItems;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful! Redirecting to order confirmation...');
    navigate('/order-confirmation');
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    if (confirm(`Remove ${productName} from cart?`)) {
      removeItem(productId);
    }
  };

  if (currentItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful jewelry to your cart to get started!</p>
          <Link
            to="/products"
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light text-gray-800">
            MY BAG ({currentItems.length})
          </h1>
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-black">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {currentItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                  <img
                    src={item.product.images[0]?.startsWith('http') 
                      ? item.product.images[0] 
                      : `/api/static/images/${item.product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">{item.product.name}</h3>
                    <div className="text-lg font-medium text-gray-900 mb-4">
                      {item.quantity} x Rs. {item.product.price.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.product.name)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">SUBTOTAL:</span>
                  <span className="font-medium">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Taxes and shipping fee will be calculated at checkout.
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-2" />
                  <span>I agree with the Terms and Conditions.</span>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <PaymentHandler
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                  <Link
                    to="/cart"
                    className="block w-full text-center py-3 text-gray-600 hover:text-black text-sm"
                  >
                    VIEW CART
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors text-center"
                >
                  LOGIN TO PROCEED
                </Link>
              )}

              {/* Features */}
              <div className="mt-8 space-y-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>🔄</span>
                  <div>
                    <div className="font-medium">NO RETURNS/EXCHANGES</div>
                    <div>ONCE SOLD</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <div className="font-medium">PURE SILVER</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <div className="font-medium">FREE SHIPPING WITHIN INDIA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;