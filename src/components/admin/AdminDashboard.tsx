import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Tag, 
  Star,
  Eye,
  EyeOff,
  Edit,
  Trash2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface DashboardStats {
  products: {
    total: number;
    inStock: number;
    outOfStock: number;
    featured: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    revenue: number;
  };
  users: {
    total: number;
    active: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats and recent products
      const [productsRes, ordersRes, allProducts] = await Promise.all([
        adminService.getProductStats(),
        adminService.getOrderStats(),
        apiService.getProducts()
      ]);

      setStats({
        products: {
          total: productsRes.result.totalProducts,
          inStock: productsRes.result.inStock,
          outOfStock: productsRes.result.outOfStock,
          featured: productsRes.result.featured
        },
        orders: {
          total: ordersRes.result.totalOrders,
          pending: ordersRes.result.pendingOrders,
          completed: ordersRes.result.completedOrders,
          revenue: ordersRes.result.totalRevenue
        },
        users: {
          total: 0, // Will be populated when user stats are available
          active: 0
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

  const toggleProductVisibility = async (productId: string, currentVisibility: boolean) => {
    try {
      await adminService.updateProductVisibility(productId, !currentVisibility);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating product visibility:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.products.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats?.products.inStock || 0} in stock</span>
            <span className="text-gray-500 ml-2">• {stats?.products.outOfStock || 0} out of stock</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.orders.total || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-600 font-medium">{stats?.orders.pending || 0} pending</span>
            <span className="text-gray-500 ml-2">• {stats?.orders.completed || 0} completed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats?.orders.revenue || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Total earnings from completed orders
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.products.featured || 0}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Products marked as featured
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0] || 'https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={product.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {(product.tags || []).slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(product.price || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.noOfProducts || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.inStock
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleProductVisibility(product.id, true)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Toggle visibility"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Tag className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Quick Tag Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              Mark products as "Most Loved"
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              Mark products as "Trending Now"
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
              Mark products as "New Launch"
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Inventory Alerts</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>{stats?.products.outOfStock || 0} products out of stock</p>
            <p>Low stock alerts: 5 products</p>
            <p>Pending reviews: 12 items</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Top category: Necklaces</p>
            <p>Best selling: Silver Bangles</p>
            <p>Conversion rate: 3.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;