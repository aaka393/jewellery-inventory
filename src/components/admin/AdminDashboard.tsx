import React from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import Card from './dashboard/Card';


const AdminDashboard: React.FC = () => {
  const { stats, recentProducts, loading, error } = useAdminDashboard();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (!stats) return <div className="text-gray-600 p-4">No data available</div>;

  return (
    <div className="space-y-4 sm:space-y-6 mt-0 px-3 sm:px-4 md:px-6 lg:px-8">
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
  {/* Header */}
  <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center justify-between">
    <h2 className="text-base sm:text-lg font-semibold text-[#5f3c2c]">Recent Products</h2>
    <span className="text-xs sm:text-sm text-gray-500">{recentProducts.length} items</span>
  </div>

  {/* Table */}
  <div className="relative overflow-auto max-h-[400px]">
    <table className="min-w-full table-fixed divide-y divide-gray-200">
      {/* Table Head */}
      <thead className="bg-[#F8F5F1] sticky top-0 z-10 text-[#5f3c2c] text-xs sm:text-sm uppercase">
        <tr>
          <th className="w-[40%] px-4 py-3 text-left font-medium tracking-wider">Product</th>
          <th className="w-[20%] px-4 py-3 text-left font-medium tracking-wider hidden md:table-cell">Category</th>
          <th className="w-[20%] px-4 py-3 text-left font-medium tracking-wider">Price</th>
          <th className="w-[20%] px-4 py-3 text-left font-medium tracking-wider">Stock</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200 text-sm">
        {recentProducts.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            {/* Product Column */}
            <td className="px-4 py-3 align-middle">
              <div className="flex items-center space-x-3">
                <img
                  src={p.images?.[0]?.startsWith('http') ? p.images[0] : `${staticImageBaseUrl}${p.images[0]}`}
                  alt={p.name}
                  className="h-10 w-10 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-gray-900 font-medium line-clamp-2">{p.name}</p>
                  <p className="md:hidden text-xs text-gray-500">{p.category}</p>
                </div>
              </div>
            </td>

            {/* Category (hidden in mobile) */}
            <td className="hidden md:table-cell px-4 py-3 align-middle text-gray-700">{p.category}</td>

            {/* Price */}
            <td className="px-4 py-3 align-middle font-semibold text-gray-900">
              {SITE_CONFIG.currencySymbol}{p.price?.toLocaleString()}
            </td>

            {/* Stock */}
            <td className="px-4 py-3 align-middle">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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




export default AdminDashboard;