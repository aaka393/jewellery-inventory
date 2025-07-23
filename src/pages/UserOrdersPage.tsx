import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../constants/siteConfig';
import { Order } from '../types';
import { formatReadableDate } from '../utils/dateUtils';

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { isAuthenticated } = useAuthStore();
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

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

  const handleCopy = (trackingNumber: string | null, orderId: string) => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 3000);
    }
  };

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'created':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'attempted':
      return <Truck className="h-4 w-4 text-orange-500" />;
    case 'paid':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'created':
      return 'bg-yellow-100 text-yellow-800';
    case 'attempted':
      return 'bg-orange-100 text-orange-800';
    case 'paid':
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
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 text-sm">
                  {/* ROW 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                    {/* Order ID */}
                    <div>
                      <span className="text-gray-500">Order ID:</span>
                      <span className="ml-1 font-medium text-gray-800 truncate">#{order.id.slice(-8)}</span>
                    </div>

                    {/* Tracking Number */}
                    <div>
                      {order.trackingNumber && (
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-gray-500">Tracking Number:</span>
                          <span className="text-green-600 font-medium truncate">{order.trackingNumber}</span>
                          <button
                            onClick={() => handleCopy(order.trackingNumber, order.id)}
                            className="text-gray-500 hover:text-gray-700 flex items-center text-xs focus:outline-none focus:ring-0"
                          >
                            {copiedOrderId === order.id ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Col 3 & 4 Empty */}
                    <div />
                    <div />
                  </div>

                  {/* ROW 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                    {/* Placed On */}
                    <div>
                      <span className="text-gray-500">Placed on:</span>
                      <span className="ml-1">{formatReadableDate(order.createdAt)}</span>
                    </div>

                    {/* Col 2 & 3 Empty */}
                    <div />
                    <div />

                    {/* Status + View */}
                    <div className="flex flex-col sm:flex-row justify-start md:justify-end items-start sm:items-center gap-2 mt-2 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 text-sm focus:outline-none focus:ring-0"
>
                        <Eye className="h-4 w-4" />
                        {selectedOrder?.id === order.id ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Hide Details</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>View Details</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ROW 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Amount */}
                    <div>
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="ml-2 font-medium">{SITE_CONFIG.currencySymbol}{(order.amount / 100).toLocaleString()}</span>
                    </div>

                    {/* Payment Status */}
                    <div>
                      <span className="text-gray-500">Payment Status:</span>
                      <span className={`ml-2 font-medium ${order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Item Count */}
                    <div>
                      <span className="text-gray-500">Items:</span>
                      <span className="ml-2 font-medium">{order.items.length} items</span>
                    </div>

                    {/* Col 4 Empty */}
                    <div />
                  </div>

                  {/* DETAILS SECTION */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm">
                      <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <img
                              src={staticImageBaseUrl + item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                              <p className="text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {SITE_CONFIG.currencySymbol}{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                          <Download className="h-4 w-4" />
                          <span>Download Invoice</span>
                        </button>
                        {order.status === 'paid' && (
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700">
                            <Package className="h-4 w-4" />
                            <span>Reorder Items</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
