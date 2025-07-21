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
  const { items, guestItems, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const currentItems = isAuthenticated ? items : guestItems;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm md:max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">MY BAG ({currentItems.length})</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div
          className={`flex-1 overflow-y-auto p-4 transition-opacity duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ height: 'calc(100vh - 180px)' }}
        >
          {currentItems.length === 0 ? (
            <div className="text-center mt-8 animate-fadeInSlow">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your bag is empty</p>
              <Link
                to="/products"
                onClick={onClose}
                className="inline-block mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 border-b pb-4 opacity-0 animate-fadeInSlow"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <img
                    src={
                      item.product.images[0]?.startsWith('http')
                        ? item.product.images[0]
                        : `${staticImageBaseUrl}/${item.product.images[0]}` ||
                          'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'
                    }
                    alt={item.product.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 mb-2">
                      {item.product.name}
                    </h3>
                    <div className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                      ₹{item.product.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity - 1)}
                          className="w-6 h-6 md:w-7 md:h-7 border rounded flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm md:text-base w-6 md:w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity + 1)}
                          className="w-6 h-6 md:w-7 md:h-7 border rounded flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
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

        {/* Footer */}
        {currentItems.length > 0 && (
          <div
            className={`border-t p-4 bg-white transition-opacity duration-700 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">SUBTOTAL:</span>
              <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Taxes and shipping fee will be calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-center text-sm text-gray-600 hover:text-black transition-colors"
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
