import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';

interface DashboardStats {
  products: {
    total: number;
    inStock: number;
    categories: Record<string, number>;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
  };
  users: {
    total: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ps, os, us, products] = await Promise.all([
          adminService.getProductStats(),
          adminService.getOrderStats(),
          adminService.getAllUsers(),
          apiService.getProducts(),
        ]);

        setStats({
          products: {
            total: ps.result.totalProducts,
            inStock: ps.result.stock,
            categories: ps.result.categories,
          },
          orders: {
            total: os.result.totalOrders,
            pending: os.result.pendingOrders,
            completed: os.result.completedOrders,
            revenue: os.result.totalRevenue,
          },
          users: {
            total: us.result?.length || 0,
          },
        });

        setRecentProducts((products || []).slice(0, 10));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={Package} title="Total Products" value={stats.products.total} note={`${stats.products.inStock} in stock`} />
        <Card icon={ShoppingCart} title="Total Orders" value={stats.orders.total} note={`${stats.orders.pending} pending • ${stats.orders.completed} completed`} />
        <Card icon={DollarSign} title="Revenue" value={`${SITE_CONFIG.currencySymbol}${stats.orders.revenue.toLocaleString()}`} note="Total earnings" />
        <Card icon={Users} title="Total Users" value={stats.users.total} note="Registered users" />
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Categories Overview</h3>
        {Object.keys(stats.products.categories).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(stats.products.categories).map(cat => (
              <div key={cat} className="bg-[#F8F5F1] rounded-lg p-4 text-center text-sm capitalize">{cat}</div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No category data available.</div>
        )}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Products</h2>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F8F5F1]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase">Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 flex items-center">
                    <img
                      src={p.images?.[0]?.startsWith('http') ? p.images[0] : `${staticImageBaseUrl}${p.images[0]}`}
                      alt={p.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="ml-4 text-sm font-medium">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.category}</td>
                  <td className="px-6 py-4 text-sm">{SITE_CONFIG.currencySymbol}{p.price?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock ? 'In Stock' : 'Out of Stock'}
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
const Card: React.FC<CardProps> = ({ icon: Icon, title, value, note }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className="p-2 bg-[#D4B896] rounded-lg"><Icon className="h-6 w-6 text-[#5f3c2c]" /></div>
      <div className="ml-4">
        <p className="text-sm font-medium text-[#5f3c2c]">{title}</p>
        <p className="text-2xl font-bold text-[#5f3c2c]">{value}</p>
      </div>
    </div>
    {note && <div className="mt-4 text-sm text-gray-500">{note}</div>}
  </div>
);

export default AdminDashboard;
