import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, Eye, Search, Heart } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';
import { SITE_CONFIG } from '../../constants/siteConfig';

interface PopularProduct {
  productId: string;
  name: string;
  viewCount: number;
  salesCount: number;
  revenue: number;
}

interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: PopularProduct[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface UserActivity {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByLocation: { location: string; count: number }[];
  topSearchQueries: { query: string; count: number }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [popularRes, salesRes, userRes] = await Promise.all([
        analyticsService.getPopularProducts(),
        analyticsService.getSalesSummary(),
        analyticsService.getUserActivity(),
      ]);

      setPopularProducts(popularRes || []);
      setSalesSummary(salesRes || null);
      setUserActivity(userRes || null);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {SITE_CONFIG.currencySymbol}{(salesSummary?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesSummary?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{userActivity?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {SITE_CONFIG.currencySymbol}{(salesSummary?.averageOrderValue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Popular Products</h3>
          </div>
          <div className="p-6">
            {popularProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {popularProducts.slice(0, 5).map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {product.viewCount} views
                          </span>
                          <span className="flex items-center">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {product.salesCount} sales
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {SITE_CONFIG.currencySymbol}{product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Search Queries */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Top Search Queries</h3>
          </div>
          <div className="p-6">
            {!userActivity?.topSearchQueries || userActivity.topSearchQueries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No search data available</p>
            ) : (
              <div className="space-y-4">
                {userActivity.topSearchQueries.slice(0, 10).map((query, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{query.query}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{query.count} searches</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {salesSummary?.revenueByMonth && salesSummary.revenueByMonth.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Revenue by Month</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {salesSummary.revenueByMonth.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(month.revenue / Math.max(...salesSummary.revenueByMonth.map(m => m.revenue))) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {SITE_CONFIG.currencySymbol}{month.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">User Statistics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-lg font-semibold text-gray-900">{userActivity?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-lg font-semibold text-green-600">{userActivity?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users</span>
                <span className="text-lg font-semibold text-blue-600">{userActivity?.newUsers || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Users by Location</h3>
          </div>
          <div className="p-6">
            {!userActivity?.usersByLocation || userActivity.usersByLocation.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No location data available</p>
            ) : (
              <div className="space-y-3">
                {userActivity.usersByLocation.slice(0, 5).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{location.location}</span>
                    <span className="text-sm font-medium text-gray-900">{location.count} users</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;