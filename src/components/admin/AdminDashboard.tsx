import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    productId?: string;
    productName?: string;
  }>({
    isOpen: false,
    type: 'single'
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats and recent products
      const [productsStatsRes, ordersStatsRes, usersRes, allProducts] = await Promise.all([
        adminService.getProductStats(),
        adminService.getOrderStats(),
        adminService.getAllUsers(),
        apiService.getProducts()
      ]);

      setStats({
        products: {
          total: productsStatsRes.result.totalProducts,
          inStock: productsStatsRes.result.stock,
          categories: productsStatsRes.result.categories
        },
        orders: {
          total: ordersStatsRes.result.totalOrders,
          pending: ordersStatsRes.result.pendingOrders,
          completed: ordersStatsRes.result.completedOrders,
          revenue: ordersStatsRes.result.totalRevenue
        },
        users: {
          total: usersRes.result?.length || 0
        }
      });

      // Get recent products (last 10)
      setRecentProducts((allProducts || []).slice(0, 10));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === recentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(recentProducts.map(p => p.id));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setActionLoading(true);
      await apiService.deleteProductById(productId);
      await loadDashboardData();
      setDeleteDialog({ isOpen: false, type: 'single' });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setActionLoading(true);
      await Promise.all(selectedProducts.map(id => apiService.deleteProductById(id)));
      setSelectedProducts([]);
      await loadDashboardData();
      setDeleteDialog({ isOpen: false, type: 'bulk' });
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      alert('Failed to delete products. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#D4B896] rounded-lg">
              <Package className="h-6 w-6 text-[#5f3c2c]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#5f3c2c]">Total Products</p>
              <p className="text-2xl font-bold text-[#5f3c2c]">{stats?.products.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats?.products.inStock || 0} in stock</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#D4B896] rounded-lg">
              <ShoppingCart className="h-6 w-6 text-[#5f3c2c]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#5f3c2c]">Total Orders</p>
              <p className="text-2xl font-bold text-[#5f3c2c]">{stats?.orders.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-600 font-medium">{stats?.orders.pending || 0} pending</span>
            <span className="text-gray-500 ml-2">• {stats?.orders.completed || 0} completed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#D4B896] rounded-lg">
              <DollarSign className="h-6 w-6 text-[#5f3c2c]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#5f3c2c]">Revenue</p>
              <p className="text-2xl font-bold text-[#5f3c2c]">{SITE_CONFIG.currencySymbol}{(stats?.orders.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Total earnings from completed orders
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-[#D4B896] rounded-lg">
              <Users className="h-6 w-6 text-[#5f3c2c]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[#5f3c2c]">Total Users</p>
              <p className="text-2xl font-bold text-[#5f3c2c]">{stats?.users.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Registered users
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#5f3c2c] mb-4">Categories Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.products.categories && Object.entries(stats.products.categories).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-[#F8F5F1] rounded-lg">
              <div className="text-2xl font-bold text-[#5f3c2c]">{count}</div>
              <div className="text-sm text-[#8f674b] capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#5f3c2c]">Recent Products</h2>
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setDeleteDialog({ isOpen: true, type: 'bulk' })}
              className="bg-red-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 text-sm lg:text-base"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete Selected ({selectedProducts.length})</span>
              <span className="sm:hidden">Delete ({selectedProducts.length})</span>
            </button>
          )}
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#F8F5F1]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === recentProducts.length && recentProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#5f3c2c] focus:ring-[#D4B896]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <tr key={product.id} className={selectedProducts.includes(product.id) ? 'bg-[#F4E1D2]' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-[#5f3c2c] focus:ring-[#D4B896]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0]?.startsWith('http')
                          ? product.images[0]
                          : `${staticImageBaseUrl}${product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                        alt={product.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#5f3c2c]">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5f3c2c]">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5f3c2c]">
                    {SITE_CONFIG.currencySymbol}{(product.price || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-[#5f3c2c] hover:text-[#5f3c2c]" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-[#5f3c2c] hover:text-[#5f3c2c]" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDialog({
                          isOpen: true,
                          type: 'single',
                          productId: product.id,
                          productName: product.name
                        })}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: 'single' })}
        onConfirm={deleteDialog.type === 'single'
          ? () => handleDeleteProduct(deleteDialog.productId!)
          : handleBulkDelete
        }
        title={deleteDialog.type === 'single' ? 'Delete Product' : 'Delete Products'}
        message={deleteDialog.type === 'single'
          ? `Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`
          : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
        }
        confirmText="Delete"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;