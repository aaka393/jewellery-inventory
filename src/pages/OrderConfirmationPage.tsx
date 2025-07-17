import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed and will be processed soon.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <Package className="h-5 w-5 text-purple-600" />
            <span>Order processing will begin shortly</span>
          </div>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <Truck className="h-5 w-5 text-purple-600" />
            <span>Expected delivery in 5-7 business days</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/products"
            className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="block w-full border border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;