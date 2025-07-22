import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG } from '../../constants/siteConfig';
import { Order } from '../../types';
import { adminService } from '../../services';
import { formatReadableDate } from '../../utils/dateUtils';
import { OrderStats } from '../../types/dashboard';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackingIds, setTrackingIds] = useState<{ [orderId: string]: string }>({});
  const [submittedTrackIds, setSubmittedTrackIds] = useState<{ [orderId: string]: boolean }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const statsRes = await adminService.getOrderStats();
      setStats(statsRes.result);
      const ordersRes = await adminService.getAllOrders();
      setOrders(ordersRes.result || []);
    } catch (error) {
      console.error('Error loading order stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackIdSubmit = async (orderId: string) => {
    const trackId = trackingIds[orderId];
    if (!trackId) return;
    try {
      await adminService.sendTrackingId(trackId, orderId);
      setSubmittedTrackIds((prev) => ({ ...prev, [orderId]: true }));
    } catch (error) {
      console.error('Failed to update tracking ID', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    statusFilter === 'all' || order.status === statusFilter
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={<Package className="h-6 w-6 text-gray-600" />} bg="bg-gray-100" />
        <StatCard label="Pending" value={stats?.pendingOrders ?? 0} icon={<Clock className="h-6 w-6 text-yellow-600" />} bg="bg-yellow-100" />
        <StatCard label="Completed" value={stats?.completedOrders ?? 0} icon={<CheckCircle className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
        <StatCard label="Revenue" value={`${SITE_CONFIG.currencySymbol}${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={<Package className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.notes.userId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{SITE_CONFIG.currencySymbol}{order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatReadableDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="text-purple-600 hover:text-purple-900 flex items-center gap-1 text-sm">
                          <Eye className="h-4 w-4" /> View
                        </button>

                        {order.status === 'paid' && (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={trackingIds[order.id] || ''}
                              onChange={(e) =>
                                setTrackingIds((prev) => ({ ...prev, [order.id]: e.target.value }))
                              }
                              placeholder="Tracking ID"
                              className="border px-2 py-1 text-sm rounded w-32"
                            />
                            <button
                              onClick={() => handleTrackIdSubmit(order.id)}
                              className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                            >
                              Send
                            </button>
                            {submittedTrackIds[order.id] && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}> = ({ label, value, icon, bg }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default OrderManagement;
