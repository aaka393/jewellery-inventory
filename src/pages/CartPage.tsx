import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import PaymentHandler from '../components/payment/PaymentHandler';
import AddressSelector from '../components/address/AddressSelector';
import { useAddressStore } from '../store/addressStore';
import { staticImageBaseUrl } from '../constants/siteConfig';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { selectedAddress } = useAddressStore();
  const navigate = useNavigate();
  const [showAddressSelector, setShowAddressSelector] = React.useState(false);

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in to view your cart</h2>
        <p className="text-gray-600 mb-8">You need to be logged in to manage your cart and proceed with checkout.</p>
        <Link
          to="/login"
          className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    const item = items.find(i => i.id === cartItemId);
    if (!item) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeItem(cartItemId);
    } else {
      updateQuantity(cartItemId, delta); // IMPORTANT: use `item.id` here
    }
  };

  const handleRemoveItem = (cartItemId: string, productName: string) => {
    if (confirm(`Remove ${productName} from cart?`)) {
      removeItem(cartItemId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 max-w-7xl">
        {!showAddressSelector ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-800">
                MY BAG ({items.length})
              </h1>
              <button 
                onClick={() => navigate('/')} 
                className="text-gray-600 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Close and continue shopping"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 sm:space-x-4 pb-3 sm:pb-4 border-b border-gray-200 last:border-b-0">
                      <img
                        src={
                          item.product.images[0]?.startsWith('http')
                            ? item.product.images[0]
                            : `${staticImageBaseUrl}/${item.product.images[0]}`
                        }
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2 leading-tight">{item.product.name}</h3>
                        <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
                          {item.quantity} x Rs. {item.product.price.toLocaleString()}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 rounded transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                            className="text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap"
                            title={`Remove ${item.product.name} from cart`}
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
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sticky top-24 lg:top-28">
                  <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SUBTOTAL:</span>
                      <span className="text-sm font-medium">Rs. {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Taxes and shipping fee will be calculated at checkout.
                    </div>
                    <div className="flex items-start text-xs text-gray-600 space-x-2">
                      <input type="checkbox" className="mr-2 mt-0.5" />
                      <span>I agree with the Terms and Conditions.</span>
                    </div>
                  </div>

                  {selectedAddress ? (
                    <>
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs sm:text-sm">
                        <p className="font-medium text-green-800">Delivering to:</p>
                        <p className="text-green-700 truncate">{selectedAddress.fullName}</p>
                        <p className="text-green-700 truncate">{selectedAddress.city}, {selectedAddress.state}</p>
                        <button
                          onClick={() => setShowAddressSelector(true)}
                          className="text-purple-600 hover:text-purple-700 text-xs mt-1 underline transition-colors"
                          title="Change delivery address"
                        >
                          Change Address
                        </button>
                      </div>
                      <PaymentHandler
                        onSuccess={(orderId) => navigate(`/order-confirmation/${orderId}`)}
                        onError={(error) => alert(`Payment failed: ${error}`)}
                      />
                    </>
                  ) : (
                    <button
                      onClick={() => setShowAddressSelector(true)}
                      className="w-full bg-black text-white py-3 text-sm rounded font-medium hover:bg-gray-800 transition-colors"
                      title="Select delivery address"
                    >
                      SELECT DELIVERY ADDRESS
                    </button>
                  )}

                  {/* Features */}
                  <div className="mt-6 space-y-3 text-xs text-gray-600">
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
          </>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setShowAddressSelector(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Back to cart"
              >
                <X className="h-5 w-5" />
                <span>Back to Cart</span>
              </button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-800">Select Delivery Address</h1>
            </div>

            <AddressSelector
              onAddressSelect={() => setShowAddressSelector(false)}
            />

            {selectedAddress && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAddressSelector(false)}
                  className="bg-purple-600 text-white px-6 sm:px-8 py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  title="Continue to payment"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
