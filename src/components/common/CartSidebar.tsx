import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { staticImageBaseUrl } from '../../constants/siteConfig';

interface CartSidebarProps {
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onClose }) => {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const handleQuantityUpdate = (id: string, delta: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const item = items.find(item => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeItem(item.productId);
    } else {
      updateQuantity(item.productId, delta);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-xs sm:max-w-sm lg:max-w-md bg-white shadow-xl flex flex-col items-center justify-center text-center px-4">
          <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-sm sm:text-base mb-2">You need to be logged in to access your cart.</p>
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-xs sm:max-w-sm lg:max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-black">
            MY BAG ({items.length})
          </h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity text-black">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto p-3 sm:p-4 transition-opacity duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {items.length === 0 ? (
            <div className="text-center mt-6 sm:mt-8 animate-fadeInSlow">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your bag is empty</p>
              <Link
                to="/products"
                onClick={onClose}
                className="inline-block mt-4 bg-black text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-2 sm:space-x-3 border-b pb-3 sm:pb-4 animate-fadeInSlow"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <img
                    src={
                      item.product.images[0]?.startsWith('http')
                        ? item.product.images[0]
                        : `${staticImageBaseUrl}/${item.product.images[0]}`
                    }
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                      ₹{item.product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, -1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center text-xs sm:text-sm hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-xs sm:text-sm w-4 sm:w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, +1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center text-xs sm:text-sm hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            className={`border-t p-3 sm:p-4 bg-white transition-opacity duration-700 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-sm sm:text-base font-semibold">SUBTOTAL:</span>
              <span className="text-sm sm:text-base font-semibold">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3 sm:mb-4">
              Taxes and shipping fee will be calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-2.5 sm:py-3 text-sm sm:text-base rounded font-medium hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-center text-xs sm:text-sm text-gray-600 hover:text-black py-2"
            >
              VIEW CART
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
