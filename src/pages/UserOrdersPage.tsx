import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SITE_CONFIG } from '../constants/siteConfig';
import { Order } from '../types';

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserOrders();
      setOrders(response || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your jewelry orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <a
              href="/products"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.orderId.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.orderId === order.orderId ? null : order)}
                        className="text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="ml-2 font-medium">{SITE_CONFIG.currencySymbol}{order.total.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`ml-2 font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <span className="ml-2 font-medium">{order.items.length} items</span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-blue-900">Tracking Number:</span>
                          <span className="ml-2 text-sm text-blue-700">{order.trackingNumber}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Details */}
                {selectedOrder?.orderId === order.orderId && (
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.image || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {SITE_CONFIG.currencySymbol}{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span>Subtotal:</span>
                        <span>{SITE_CONFIG.currencySymbol}{order.subtotal.toLocaleString()}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Tax:</span>
                          <span>{SITE_CONFIG.currencySymbol}{order.tax.toLocaleString()}</span>
                        </div>
                      )}
                      {order.shipping > 0 && (
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span>Shipping:</span>
                          <span>{SITE_CONFIG.currencySymbol}{order.shipping.toLocaleString()}</span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between items-center text-sm mt-1 text-green-600">
                          <span>Discount:</span>
                          <span>-{SITE_CONFIG.currencySymbol}{order.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                        <span>Total:</span>
                        <span>{SITE_CONFIG.currencySymbol}{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                        <Download className="h-4 w-4" />
                        <span>Download Invoice</span>
                      </button>
                      {order.status === 'delivered' && (
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700">
                          <Package className="h-4 w-4" />
                          <span>Reorder Items</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;