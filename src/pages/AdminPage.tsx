import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Upload, 
  Tag, 
  Users, 
  ShoppingCart,
  Settings,
  FileText
} from 'lucide-react';
import { Product, Category, Tag as TagType } from '../types';
import { apiService } from '../services/api';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import CSVUploader from '../components/admin/CSVUploader';
import EditProductDialog from '../components/admin/EditProductDialog';
import NotificationToast from '../components/admin/NotificationToast';
import CreateItemDialog from '../components/common/CreateItemDialog';
import SEOHead from '../components/seo/SEOHead';
import StockManagement from '../components/admin/StockManagement';
import { SITE_CONFIG } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null
  });

  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const [createCategoryDialog, setCreateCategoryDialog] = useState(false);
  const [createTagDialog, setCreateTagDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, tagsRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
        apiService.getTags(),
      ]);
      setProducts(productsRes || []);
      setCategories(categoriesRes || []);
      setTags(tagsRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setProducts([]);
      setCategories([]);
      setTags([]);
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!productData.id) {
      showNotification('Missing product ID', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await apiService.updateProduct(productData.id, productData);
      await loadData();
      setEditDialog({ isOpen: false, product: null });
      showNotification('Product updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('Error updating product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCategory = async (name: string, description?: string) => {
    if (name) {
      try {
        await apiService.createCategory({ name, description: description || '' });
        await loadData();
        showNotification('Category created successfully!', 'success');
      } catch (error) {
        console.error('Error creating category:', error);
        showNotification('Error creating category', 'error');
      } finally {
        setCreateCategoryDialog(false);
      }
    }
  };

  const handleCreateTag = async (name: string) => {
    if (name) {
      try {
        await apiService.createTag({ name });
        await loadData();
        showNotification('Tag created successfully!', 'success');
      } catch (error) {
        console.error('Error creating tag:', error);
        showNotification('Error creating tag', 'error');
      } finally {
        setCreateTagDialog(false);
      }
    }
  };

  const handleBulkTagUpdate = async (tagName: string, productIds: string[]) => {
    try {
      setActionLoading(true);
      const updates = productIds.map(productId => ({
        productId,
        tags: [...(products.find(p => p.id === productId)?.tags || []), tagName]
      }));
      
      await adminService.bulkUpdateProductTags(updates);
      await loadData();
      showNotification(`Added "${tagName}" tag to ${productIds.length} products`, 'success');
    } catch (error) {
      console.error('Error updating tags:', error);
      showNotification('Error updating product tags', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'stock', label: 'Stock Management', icon: Package },
    { id: 'upload', label: 'Bulk Upload', icon: Upload },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  const categoryNames = categories.map(cat => cat.name);
  const tagNames = tags.map(tag => tag.name);

  return (
    <>
      <SEOHead
        title={`Admin Dashboard - ${SITE_CONFIG.name}`}
        description="Manage your jewelry store inventory, orders, and settings"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600">{SITE_CONFIG.name}</p>
            </div>
            
            <nav className="mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                      : 'text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === 'dashboard' && <AdminDashboard />}
            
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
                  <div className="flex space-x-4">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const selectedProducts = products.filter(p => p.featured).map(p => p.id);
                          handleBulkTagUpdate(e.target.value, selectedProducts);
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Bulk Tag Featured Products</option>
                      <option value="mostLoved">Most Loved</option>
                      <option value="trendingNow">Trending Now</option>
                      <option value="newLaunch">New Launch</option>
                      <option value="gifting">Gifting</option>
                      <option value="925silver">925 Silver</option>
                      <option value="dailyWear">Daily Wear</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                            Tags
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
                                  src={product.images?.[0] || 'https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {SITE_CONFIG.currencySymbol}{(product.price || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.inStock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                Qty: {product.noOfProducts || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {(product.tags || []).slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {(product.tags || []).length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{(product.tags || []).length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => setEditDialog({ isOpen: true, product })}
                                className="text-purple-600 hover:text-purple-900 mr-3"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stock' && <StockManagement />}

            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Bulk Product Upload</h2>
                <CSVUploader
                  onSuccess={() => {
                    loadData();
                    showNotification('Products uploaded successfully!', 'success');
                  }}
                  onError={(error) => showNotification(error, 'error')}
                />
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Categories ({categories.length})</h2>
                  <button
                    onClick={() => setCreateCategoryDialog(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Add Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                      <div className="text-xs text-gray-500">
                        {products.filter(p => p.category === category.name).length} products
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Tags ({tags.length})</h2>
                  <button
                    onClick={() => setCreateTagDialog(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Add Tag
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => {
                      const productCount = products.filter(p => 
                        (p.tags || []).includes(tag.name)
                      ).length;
                      
                      return (
                        <div
                          key={tag.id}
                          className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full"
                        >
                          <span className="font-medium">{tag.name}</span>
                          <span className="ml-2 text-sm text-purple-600">({productCount})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrderManagement />
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">User management coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-gray-600">Settings panel coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Product Dialog */}
        <EditProductDialog
          isOpen={editDialog.isOpen}
          onClose={() => setEditDialog({ isOpen: false, product: null })}
          onSave={handleEditProduct}
          product={editDialog.product}
          categories={categoryNames}
          tags={tagNames}
          loading={actionLoading}
        />

        {/* Create Category Dialog */}
        <CreateItemDialog
          isOpen={createCategoryDialog}
          onClose={() => setCreateCategoryDialog(false)}
          onSave={handleCreateCategory}
          title="Create Category"
          type="category"
        />

        {/* Create Tag Dialog */}
        <CreateItemDialog
          isOpen={createTagDialog}
          onClose={() => setCreateTagDialog(false)}
          onSave={handleCreateTag}
          title="Create Tag"
          type="tag"
        />

        {/* Notification Toast */}
        <NotificationToast
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </>
  );
};

export default AdminPage;