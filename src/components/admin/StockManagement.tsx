import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, TrendingUp, Edit } from 'lucide-react';
import { stockService } from '../../services/stockService';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
}

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, alertsRes] = await Promise.all([
        apiService.getProducts(),
        stockService.getStockAlerts(),
      ]);
      
      setProducts(productsRes || []);
      setStockAlerts(alertsRes.result || []);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newQuantity: number) => {
    try {
      await stockService.updateProductStock(productId, newQuantity);
      await loadData(); // Refresh data
      setEditingStock(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const getLowStockProducts = () => {
    return products.filter(product => 
      product.noOfProducts <= 5 && product.inStock
    );
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => !product.inStock || product.noOfProducts === 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = getOutOfStockProducts();

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{products.reduce((total, p) => total + (p.price * p.noOfProducts), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Stock Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stockAlerts.map((alert) => (
                <div key={alert.productId} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{alert.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Current stock: {alert.currentStock} | Threshold: {alert.threshold}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                    Low Stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Stock Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Product Stock Management</h2>
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
                  Current Stock
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0]?.startsWith('http') 
                          ? product.images[0] 
                          : `/api/static/images/${product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                        alt={product.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingStock[product.id] !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editingStock[product.id]}
                          onChange={(e) => setEditingStock(prev => ({
                            ...prev,
                            [product.id]: parseInt(e.target.value) || 0
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                        />
                        <button
                          onClick={() => handleStockUpdate(product.id, editingStock[product.id])}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingStock(prev => {
                            const updated = { ...prev };
                            delete updated[product.id];
                            return updated;
                          })}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {product.noOfProducts}
                        </span>
                        <button
                          onClick={() => setEditingStock(prev => ({
                            ...prev,
                            [product.id]: product.noOfProducts
                          }))}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      !product.inStock || product.noOfProducts === 0
                        ? 'bg-red-100 text-red-800'
                        : product.noOfProducts <= 5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {!product.inStock || product.noOfProducts === 0
                        ? 'Out of Stock'
                        : product.noOfProducts <= 5
                        ? 'Low Stock'
                        : 'In Stock'
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingStock(prev => ({
                        ...prev,
                        [product.id]: product.noOfProducts
                      }))}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      Update Stock
                    </button>
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

export default StockManagement;