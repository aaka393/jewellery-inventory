import React from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCheckoutStore } from '../stores/checkoutStore';

// Sample jewelry data for demonstration
const sampleJewelry = [
  {
    productId: 'ring-001',
    name: 'Diamond Solitaire Ring',
    price: 299999, // ₹2999.99 in paise
    image: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    productId: 'necklace-001',
    name: 'Gold Pearl Necklace',
    price: 89999, // ₹899.99 in paise
    image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    productId: 'earrings-001',
    name: 'Silver Drop Earrings',
    price: 49999, // ₹499.99 in paise
    image: 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const CartManager: React.FC = () => {
  const { 
    cartItems, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    getTotalAmount, 
    getTotalItems 
  } = useCheckoutStore();

  const formatCurrency = (amountInPaise: number) => {
    return (amountInPaise / 100).toFixed(2);
  };

  const getCartItem = (productId: string) => {
    return cartItems.find(item => item.productId === productId);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Jewelry Collection
        </h2>
      </div>

      <div className="p-6">
        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sampleJewelry.map((item) => {
            const cartItem = getCartItem(item.productId);
            return (
              <div key={item.productId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-purple-600 font-bold text-lg mb-3">
                    ₹{formatCurrency(item.price)}
                  </p>
                  
                  {cartItem ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, cartItem.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, cartItem.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-bold text-purple-900 mb-4">Cart Summary</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between items-center text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">₹{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-purple-300 pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total ({getTotalItems()} items):</span>
                <span className="text-purple-600">₹{formatCurrency(getTotalAmount())}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartManager;