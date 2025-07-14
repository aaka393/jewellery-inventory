import React from 'react';
import { Gem } from 'lucide-react';
import CheckoutWithLogin from '../components/CheckoutWithLogin';
import CartManager from '../components/CartManager';
import { useCheckoutStore } from '../stores/checkoutStore';

const CheckoutPage: React.FC = () => {
  const { cartItems } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gem className="h-10 w-10 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Jewelry Store Checkout</h1>
          </div>
          <p className="text-gray-600">
            Browse our collection and complete your purchase with Razorpay
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Product Selection */}
          <div>
            <CartManager />
          </div>

          {/* Right Column - Checkout */}
          <div className="lg:sticky lg:top-8">
            <CheckoutWithLogin />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Instructions</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• Add jewelry items to your cart using the "Add to Cart" buttons</p>
            <p>• Click "Pay Now" to start the checkout process</p>
            <p>• If not logged in, you'll see a registration modal</p>
            <p>• After registration, Razorpay checkout will open automatically</p>
            <p>• Use test card: 4111 1111 1111 1111, any future date, any CVV</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;