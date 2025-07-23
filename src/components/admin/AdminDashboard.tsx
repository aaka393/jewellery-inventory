import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Eye } from 'lucide-react';
import { Product } from '../../types';
import { DashboardStats } from '../../types/dashboard';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';

const AdminDashboard: React.FC = () => {
  const { stats, recentProducts, loading, error } = useAdminDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (!stats) return <div className="text-gray-600 p-4">No data available</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card icon={Package} title="Total Products" value={stats.products.total} note={`${stats.products.inStock} in stock`} />
        <Card icon={ShoppingCart} title="Total Orders" value={stats.orders.total} note={`${stats.orders.pending} pending • ${stats.orders.completed} completed`} />
        <Card icon={DollarSign} title="Revenue" value={`${SITE_CONFIG.currencySymbol}${stats.orders.revenue.toLocaleString()}`} note="Total earnings" />
        <Card icon={Users} title="Total Users" value={stats.users.total} note="Registered users" />
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#5f3c2c]">Categories Overview</h3>
        {Object.keys(stats.products.categories).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {Object.keys(stats.products.categories).map(cat => (
              <div key={cat} className="bg-[#F8F5F1] rounded-lg p-2 sm:p-3 text-center text-xs sm:text-sm capitalize text-[#5f3c2c] font-medium">
                {cat}
                <div className="text-xs text-gray-500 mt-1">
                  {stats.products.categories[cat]} items
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-gray-500">No category data available.</div>
        )}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-[#5f3c2c]">Recent Products</h2>
          <span className="text-xs sm:text-sm text-gray-500">{recentProducts.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F8F5F1]">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">Product</th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">Category</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">Price</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 flex items-center">
                    <img
                      src={p.images?.[0]?.startsWith('http') ? p.images[0] : `${staticImageBaseUrl}${p.images[0]}`}
                      alt={p.name}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{p.name}</div>
                      <div className="md:hidden text-xs text-gray-500 mt-1">{p.category}</div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{p.category}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{SITE_CONFIG.currencySymbol}{p.price?.toLocaleString()}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full ${p.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock ? 'In Stock' : 'Out'}
                    </span>
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

interface CardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  note?: string;
}

interface CardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  note?: string;
}
const Card: React.FC<CardProps> = ({ icon: Icon, title, value, note }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center">
      <div className="p-2 sm:p-3 bg-[#D4B896] rounded-lg flex-shrink-0">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#5f3c2c]" />
      </div>
      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-medium text-[#5f3c2c] truncate">{title}</p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{value}</p>
        {note && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{note}</p>}
      </div>
    </div>
  </div>
);

export default AdminDashboard;