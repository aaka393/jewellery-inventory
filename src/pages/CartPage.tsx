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
  const { items, guestItems, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { selectedAddress } = useAddressStore();
  const navigate = useNavigate();
  const [showAddressSelector, setShowAddressSelector] = React.useState(false);

  // Use appropriate items based on auth status
  const currentItems = isAuthenticated ? items : guestItems;
  console.log(currentItems, "currentItems")

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = currentItems.find(item => item.productId === productId);
    if (!item) return;

    if (item.quantity === 1 && delta === -1) {
      removeItem(item.id); // Use cartId instead of productId
    } else {
      updateQuantity(item.id, item.quantity + delta); // Use cartId instead of productId
    }
  };

  const handleRemoveItem = (cartId: string, productName: string) => {
    if (confirm(`Remove ${productName} from cart?`)) {
      removeItem(cartId); // Use cartId instead of productId
    }
  };


  // const handlePaymentSuccess = () => {
  //   onSuccess: (orderId: string) => {
  //     navigate(`/order-confirmation/${orderId}`);
  //   },
  // };

  const handlePaymentSuccess = (orderId: string) => {
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
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
      <div className="container mx-auto mt-16 sm:mt-20 px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {!showAddressSelector ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl font-light text-gray-800">
                MY BAG ({currentItems.length})
              </h1>
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-black p-2 -mr-2">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="space-y-4 sm:space-y-6">
                  {currentItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 sm:space-x-4 pb-4 sm:pb-6 border-b border-gray-200">
                      <img
                        src={item.product.images[0]?.startsWith('http')
                          ? item.product.images[0]
                          : `${staticImageBaseUrl}/${item.product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-gray-800 mb-2 line-clamp-2">{item.product.name}</h3>
                        <div className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                          {item.quantity} x Rs. {item.product.price.toLocaleString()}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center space-x-2 order-1">
                            <button
                              onClick={() => handleQuantityChange(item.productId, -1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 rounded"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50 rounded"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id, item.product.name)}
                            className="text-xs sm:text-sm text-gray-400 hover:text-red-500 order-2"
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
                <div className="bg-gray-50 p-4 sm:p-6 rounded sticky top-20">
                  <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-4 sm:mb-6">Order Summary</h2>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-600">SUBTOTAL:</span>
                      <span className="text-sm sm:text-base font-medium">Rs. {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      Taxes and shipping fee will be calculated at checkout.
                    </div>
                    <div className="flex items-start text-xs sm:text-sm text-gray-600 space-x-2">
                      <input type="checkbox" className="mr-2" />
                      <span>I agree with the Terms and Conditions.</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="space-y-2 sm:space-y-3">
                      {selectedAddress ? (
                        <>
                          <div className="mb-3 sm:mb-4 p-3 bg-green-50 border border-green-200 rounded text-xs sm:text-sm">
                            <p className="font-medium text-green-800">Delivering to:</p>
                            <p className="text-green-700">{selectedAddress.fullName}</p>
                            <p className="text-green-700">{selectedAddress.city}, {selectedAddress.state}</p>
                            <button
                              onClick={() => setShowAddressSelector(true)}
                              className="text-purple-600 hover:text-purple-700 text-xs mt-1 underline"
                            >
                              Change Address
                            </button>
                          </div>
                          <PaymentHandler
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </>
                      ) : (
                        <button
                          onClick={() => setShowAddressSelector(true)}
                          className="w-full bg-black text-white py-2.5 sm:py-3 text-sm sm:text-base rounded font-medium hover:bg-gray-800 transition-colors"
                        >
                          SELECT DELIVERY ADDRESS
                        </button>
                      )}
                      <Link
                        to="/cart"
                        className="block w-full text-center py-2 sm:py-3 text-gray-600 hover:text-black text-xs sm:text-sm"
                      >
                        VIEW CART
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full bg-black text-white py-2.5 sm:py-3 text-sm sm:text-base rounded font-medium hover:bg-gray-800 transition-colors text-center"
                    >
                      LOGIN TO PROCEED
                    </Link>
                  )}

                  {/* Features */}
                  <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-xs text-gray-600">
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
            <div className="flex items-center mb-4 sm:mb-6">
              <button
                onClick={() => setShowAddressSelector(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mr-4 p-2 -ml-2"
              >
                <X className="h-5 w-5" />
                <span>Back to Cart</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-light text-gray-800">Select Delivery Address</h1>
            </div>

            <AddressSelector
              onAddressSelect={(address) => {
                setShowAddressSelector(false);
              }}
            />

            {selectedAddress && (
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={() => setShowAddressSelector(false)}
                  className="bg-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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