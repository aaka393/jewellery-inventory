import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useAuthStore } from '../stores/authStore';
import { usePaymentStore } from '../stores/paymentStore';
import RazorpayCheckout from '../components/RazorpayCheckout';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCartStore();
  const { formData, updateFormData, resetForm } = useCheckoutStore();
  const { user } = useAuthStore();
  const { success, clearPaymentState } = usePaymentStore();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setPaymentError(null);
    resetForm();
    clearPaymentState();
    
    // Auto redirect after success
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  const totalAmount = getTotalPrice();
  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.mobile;

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some beautiful jewelry to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Browse Jewelry
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase from Yensi Jewels. Your jewelry will be shipped soon.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              Amount Paid: ₹{totalAmount.toFixed(2)}
            </p>
            <p className="text-green-700 text-sm mt-1">
              Payment processed securely via Razorpay
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to homepage in a few seconds...
          </p>
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
          Back to Shopping
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white p-6">
            <div className="flex items-center">
              <Lock className="h-6 w-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Secure Checkout</h1>
                <p className="text-purple-100 text-sm mt-1">Complete your jewelry purchase</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.description}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.description}</h3>
                      <p className="text-sm text-purple-600 capitalize">{item.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">
                        ₹{(parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">₹{totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Includes all taxes • Free shipping on orders above ₹500
                </p>
              </div>
            </div>

            {/* Customer Information & Payment */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
              
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={user?.firstName || "John"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={user?.lastName || "Doe"}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={user?.email || "john@example.com"}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Form Validation Warning */}
              {!isFormValid && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-sm">
                      Please fill in all required fields before proceeding to payment.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Error */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Payment Error</h4>
                    <p className="text-red-700 text-sm mt-1">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                {isFormValid ? (
                  <RazorpayCheckout 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-gray-600">Complete the form above to proceed with payment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;