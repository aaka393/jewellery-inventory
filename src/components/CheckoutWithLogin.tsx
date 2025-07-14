import React, { useState } from 'react';
import { ShoppingCart, CreditCard, Loader2, User, Package, IndianRupee } from 'lucide-react';
import { useCheckoutStore } from '../stores/checkoutStore';
import LoginRegisterModal from './LoginRegisterModal';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

const CheckoutWithLogin: React.FC = () => {
  const { 
    cartItems, 
    customer, 
    getTotalAmount, 
    getTotalItems,
    clearCart 
  } = useCheckoutStore();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalAmount = getTotalAmount();
  const totalItems = getTotalItems();

  const formatCurrency = (amountInPaise: number) => {
    return (amountInPaise / 100).toFixed(2);
  };

  const createRazorpayOrder = async () => {
    if (!customer) {
      setError('Customer information is required');
      return null;
    }

    setIsProcessingOrder(true);
    setError(null);

    try {
      const response = await fetch('/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          notes: {
            customerId: customer.customerId
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      return orderData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePayment = async () => {
    if (!customer) {
      setShowLoginModal(true);
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const orderData = await createRazorpayOrder();
    if (!orderData) return;

    setIsProcessingPayment(true);

    const options: RazorpayOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your Razorpay key
      amount: totalAmount,
      currency: 'INR',
      name: 'Jewelry Store',
      description: `Payment for ${totalItems} jewelry items`,
      order_id: orderData.order_id,
      handler: (response: any) => {
        console.log('Payment successful:', response);
        setSuccess(true);
        setIsProcessingPayment(false);
        clearCart();
        
        // You can make an API call here to verify payment
        // verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      },
      theme: {
        color: '#9333ea', // Purple theme
      },
      modal: {
        ondismiss: () => {
          setIsProcessingPayment(false);
          setError('Payment was cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Automatically proceed to payment after successful login
    setTimeout(() => {
      handlePayment();
    }, 500);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your jewelry will be shipped soon.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">
            Amount Paid: ₹{formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          Checkout ({totalItems} items)
        </h2>
      </div>

      <div className="p-6">
        {/* Customer Info */}
        {customer ? (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">Customer Information</h3>
            </div>
            <div className="text-sm text-purple-700">
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.contact}</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-amber-900">Customer Information Required</h3>
            </div>
            <p className="text-sm text-amber-700">
              Please provide your details to continue with the payment.
            </p>
          </div>
        )}

        {/* Cart Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <Package className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Order Summary</h3>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-sm">Your cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold">
                    ₹{formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-2 mt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600 flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Pay Now Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessingOrder || isProcessingPayment || cartItems.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-bold text-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessingOrder ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating Order...
            </>
          ) : isProcessingPayment ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay ₹{formatCurrency(totalAmount)}
            </>
          )}
        </button>

        {!customer && (
          <p className="text-center text-sm text-gray-600 mt-3">
            You'll be asked to provide your details before payment
          </p>
        )}
      </div>

      {/* Login/Register Modal */}
      <LoginRegisterModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default CheckoutWithLogin;