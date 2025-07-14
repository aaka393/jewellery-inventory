import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { paymentService } from '../services/paymentService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatPrice } from '../utils/formatters';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: 'card' as const,
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/payment' } });
      return;
    }

    if (items.length === 0) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, items.length]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create order
      const order = await paymentService.createOrder({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          isPreorder: item.isPreorder,
        })),
        shippingAddress,
        billingAddress: shippingAddress,
      });

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(order.id);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm payment
      await paymentService.confirmPayment(paymentIntent.id, 'pm_card_visa');

      clearCart();
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {step === 'success' ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/orders')}>
                View Orders
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Panel - Forms */}
            <div className="space-y-8">
              {/* Step Indicator */}
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${step === 'address' ? 'text-purple-600' : 'text-green-600'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'address' ? 'bg-purple-600 text-white' : 'bg-green-500 text-white'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Shipping Address</span>
                </div>
                <div className={`w-8 h-0.5 ${step === 'payment' ? 'bg-purple-600' : 'bg-gray-300'}`} />
                <div className={`flex items-center ${step === 'payment' ? 'text-purple-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'payment' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
              </div>

              {/* Address Form */}
              {step === 'address' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
                  
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <Input
                      label="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                      <Input
                        label="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="ZIP Code"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        required
                      />
                      <Input
                        label="Country"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <Input
                      label="Cardholder Name"
                      value={paymentMethod.cardholderName}
                      onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                      required
                    />
                    
                    <Input
                      label="Card Number"
                      value={paymentMethod.cardNumber}
                      onChange={(e) => setPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="Month"
                        value={paymentMethod.expiryMonth}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, expiryMonth: e.target.value }))}
                        placeholder="MM"
                        maxLength={2}
                        required
                      />
                      <Input
                        label="Year"
                        value={paymentMethod.expiryYear}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, expiryYear: e.target.value }))}
                        placeholder="YY"
                        maxLength={2}
                        required
                      />
                      <Input
                        label="CVV"
                        value={paymentMethod.cvv}
                        onChange={(e) => setPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isLoading}
                      leftIcon={<CreditCard className="h-4 w-4" />}
                    >
                      Pay {formatPrice(totalAmount)}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Panel - Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.isPreorder && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Pre-order
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(totalAmount * 0.18)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-purple-600">{formatPrice(totalAmount * 1.18)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;