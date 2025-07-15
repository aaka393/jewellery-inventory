import React, { useEffect } from 'react';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { usePaymentStore } from '../stores/paymentStore';
import { useCheckoutStore } from '../stores/checkoutStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ onSuccess, onError }) => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { formData } = useCheckoutStore();
  const { createOrder, verifyPayment, isProcessing, error } = usePaymentStore();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      onError('Razorpay SDK not loaded');
      return;
    }

    try {
      const totalAmount = getTotalPrice();
      const amountInPaise = Math.round(totalAmount * 100);

      // Prepare cart metadata
      const productIds = items.map(item => item.id);
      const productCounts: Record<string, number> = {};
      items.forEach(item => {
        productCounts[item.id] = item.quantity;
      });

      // Create order payload
      const orderPayload = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user?.id || 'guest',
          name: `${formData.firstName || user?.firstName || ''} ${formData.lastName || user?.lastName || ''}`.trim(),
          email: formData.email || user?.email || '',
          phone: formData.mobile || user?.mobile || '',
          productIds,
          productCounts
        }
      };

      // Create order on backend
      const order = await createOrder(orderPayload);

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your key
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Yensi Jewels',
        description: 'Jewellery Order Payment',
        image: '/favicon.ico', // Your logo
        prefill: {
          name: orderPayload.notes.name,
          email: orderPayload.notes.email,
          contact: orderPayload.notes.phone
        },
        theme: {
          color: '#9333ea' // Purple theme
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResult) {
              clearCart();
              onSuccess();
            } else {
              onError('Payment verification failed');
            }
          } catch (err: any) {
            onError(err.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            onError('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      onError(err.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="space-y-4">
      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
        <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
        <div>
          <h4 className="font-semibold text-green-900">Secure Payment</h4>
          <p className="text-green-700 text-sm mt-1">
            Your payment is secured by Razorpay with 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || items.length === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center text-lg"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-3" />
            Pay ₹{getTotalPrice().toFixed(2)} with Razorpay
          </>
        )}
      </button>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Accepted Payment Methods</p>
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
          <span>Credit Cards</span>
          <span>•</span>
          <span>Debit Cards</span>
          <span>•</span>
          <span>Net Banking</span>
          <span>•</span>
          <span>UPI</span>
          <span>•</span>
          <span>Wallets</span>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center text-xs text-gray-500">
        <Lock className="h-3 w-3 mr-1" />
        <span>Powered by Razorpay</span>
      </div>
    </div>
  );
};

export default RazorpayCheckout;