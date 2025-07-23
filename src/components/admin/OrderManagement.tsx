import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  const filteredOrders = orders
    .filter(order =>
      (
        statusFilter === 'all' ||
        (statusFilter === 'track-id-pending' && !submittedTrackIds[order.id]) ||
        (statusFilter === 'track-id-sent' && submittedTrackIds[order.id])
      ) &&
      (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.notes.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      if (sortField === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortField === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-2 md:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={<Package className="h-6 w-6 text-gray-600" />} bg="bg-gray-100" />
        <StatCard label="Pending" value={stats?.pendingOrders ?? 0} icon={<Clock className="h-6 w-6 text-yellow-600" />} bg="bg-yellow-100" />
        <StatCard label="Completed" value={stats?.completedOrders ?? 0} icon={<CheckCircle className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
        <StatCard label="Revenue" value={`${SITE_CONFIG.currencySymbol}${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={<Package className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <div className="p-4 border-b border-gray-200 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Orders</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-2">
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Product"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'date' | 'amount' | 'status')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
              title="Toggle sort order"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Orders</option>
              <option value="track-id-pending">Pending Track ID</option>
              <option value="track-id-sent">Track ID Sent</option>
            </select>
          </div>
        </div>

        {/* Table or List View */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Shipping Address', 'Actions'].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="whitespace-nowrap">
                  <td className="px-4 py-4 text-sm text-gray-800">#{order.id.slice(-8)}</td>
                  <td className="px-4 py-4 text-gray-900">{order.notes.userId}</td>
                  <td className="px-4 py-4 text-gray-700 space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <img
                          src={`${staticImageBaseUrl}/${item.image}`}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded border"
                        />
                        <div>
                          <p className="text-xs text-gray-500">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} | ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 text-gray-900">{SITE_CONFIG.currencySymbol}{order.amount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {order.status === 'paid' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      )}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{formatReadableDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-gray-700 text-xs">
                    <div>
                      <div className="text-sm text-gray-800">{order.shippingAddress.fullName}</div>

                      <div>
                        {order.shippingAddress.houseNumber}, {order.shippingAddress.streetArea}, {order.shippingAddress.landmark}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                        📞 {order.shippingAddress.mobileNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium">
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="text-purple-600 hover:text-purple-900 flex items-center gap-1 text-sm">
                        <Eye className="h-4 w-4" /> View
                      </button>
                      {order.status === 'paid' && (
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={trackingIds[order.id] || ''}
                            onChange={(e) =>
                              setTrackingIds((prev) => ({ ...prev, [order.id]: e.target.value }))
                            }
                            placeholder="Tracking ID"
                            className="border px-2 py-1 text-sm rounded w-full max-w-[150px]"
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
