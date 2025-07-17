import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/api';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SITE_CONFIG } from '../../constants/siteConfig';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentHandlerProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({ onSuccess, onError }) => {
  const { getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { trackPurchase } = useAnalytics();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        onError('Failed to load payment gateway');
        return;
      }

      const totalAmount = getTotalPrice();

      if (totalAmount <= 0) {
        onError('Cart is empty or invalid amount');
        return;
      }

      // Create order
      const orderData = await apiService.createOrder({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user?.id || 'guest',
          userEmail: user?.email || '',
        },
      });

      if (!orderData || !orderData.id) {
        onError('Failed to create order');
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key',
        amount: orderData.amount,
        currency: orderData.currency,
        name: SITE_CONFIG.name,
        description: 'Jewelry Purchase',
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            if (!response || !response.razorpay_order_id) {
              onError('Invalid payment response');
              return;
            }

            // Verify payment
            const verificationResult = await apiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult?.status === 'success') {
              // Track successful purchase
              trackPurchase(orderData.id, totalAmount);
              clearCart();
              onSuccess();
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError('Payment verification failed');
          }
        },
        prefill: {
          name: user ? `${user.firstname} ${user.lastname}` : '',
          email: user?.email || '',
          contact: user?.contact || '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            onError('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onError('Failed to initiate payment');
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors"
    >
      PROCEED TO CHECKOUT
    </button>
  );
};

export default PaymentHandler;