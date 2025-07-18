import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Upload, 
  Tag, 
  Users, 
  ShoppingCart,
  Settings,
  FileText,
  Globe,
  Star,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { Product, Category, Tag as TagType } from '../types';
import { apiService } from '../services/api';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import CSVUploader from '../components/admin/CSVUploader';
import ProductDialog from '../components/admin/ProductDialog';
import NotificationToast from '../components/admin/NotificationToast';
import CategoryDialog from '../components/common/CategoryDialog';
import TagDialog from '../components/common/TagDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SEOHead from '../components/seo/SEOHead';
import StockManagement from '../components/admin/StockManagement';
import { SITE_CONFIG } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import UserManagement from '../components/admin/UserManagement';
import SitemapGenerator from '../components/seo/SitemapGenerator';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

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

  const [categoryDialog, setCategoryDialog] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null
  });

  const [tagDialog, setTagDialog] = useState<{
    isOpen: boolean;
    tag: TagType | null;
  }>({
    isOpen: false,
    tag: null
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'category' | 'tag';
    item: Category | TagType | null;
  }>({
    isOpen: false,
    type: 'category',
    item: null
  });

  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      const res = await apiService.uploadProductImage(file);
      if (!res || !res.url) {
        throw new Error('Image upload failed');
      }
      return res?.url || null;
    } catch (error) {
      console.error('Image upload failed:', error);
      showNotification('Failed to upload image', 'error');
      return null;
    }
  };

  const handleProductDialog = async (productData: Partial<Product>) => {
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

  const handleCreateCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setActionLoading(true);
      await apiService.createCategory(categoryData);
      await loadData();
      setCategoryDialog({ isOpen: false, category: null });
      showNotification('Category created successfully!', 'success');
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('Error creating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!categoryDialog.category?.id) return;
    
    try {
      setActionLoading(true);
      // await apiService.updateCategory(categoryDialog.category.id, categoryData);
      await loadData();
      setCategoryDialog({ isOpen: false, category: null });
      showNotification('Category updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification('Error updating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTag = async (tagData: Omit<TagType, 'id'>) => {
    try {
      setActionLoading(true);
      await apiService.createTag(tagData);
      await loadData();
      setTagDialog({ isOpen: false, tag: null });
      showNotification('Tag created successfully!', 'success');
    } catch (error) {
      console.error('Error creating tag:', error);
      showNotification('Error creating tag', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTag = async (tagData: Omit<TagType, 'id'>) => {
    if (!tagDialog.tag?.id) return;
    
    try {
      setActionLoading(true);
      // await apiService.updateTag(tagDialog.tag.id, tagData);
      await loadData();
      setTagDialog({ isOpen: false, tag: null });
      showNotification('Tag updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating tag:', error);
      showNotification('Error updating tag', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setActionLoading(true);
      await apiService.deleteCategory(categoryId);
      await loadData();
      setDeleteDialog({ isOpen: false, type: 'category', item: null });
      showNotification('Category deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('Error deleting category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDeleteCategories = async () => {
    try {
      setActionLoading(true);
      await Promise.all(selectedCategories.map(id => apiService.deleteCategory(id)));
      setSelectedCategories([]);
      await loadData();
      showNotification(`Deleted ${selectedCategories.length} categories`, 'success');
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      showNotification('Error deleting categories', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDeleteTags = async () => {
    try {
      setActionLoading(true);
      // await Promise.all(selectedTags.map(id => apiService.deleteTag(id)));
      setSelectedTags([]);
      await loadData();
      showNotification(`Deleted ${selectedTags.length} tags`, 'success');
    } catch (error) {
      console.error('Error bulk deleting tags:', error);
      showNotification('Error deleting tags', 'error');
    } finally {
      setActionLoading(false);
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
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'stock', label: 'Stock Management', icon: Package },
    { id: 'upload', label: 'Bulk Upload', icon: Upload },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'seo', label: 'SEO & Sitemap', icon: Globe },
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
            
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            
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
                  <div className="flex space-x-3">
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={handleBulkDeleteCategories}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Selected ({selectedCategories.length})</span>
                      </button>
                    )}
                    <button
                      onClick={() => setCategoryDialog({ isOpen: true, category: null })}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedCategories.length === categories.length && categories.length > 0}
                            onChange={() => {
                              if (selectedCategories.length === categories.length) {
                                setSelectedCategories([]);
                              } else {
                                setSelectedCategories(categories.map(c => c.id!));
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
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
                      {categories.map((category) => (
                        <tr key={category.id} className={selectedCategories.includes(category.id!) ? 'bg-purple-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.id!)}
                              onChange={() => {
                                if (selectedCategories.includes(category.id!)) {
                                  setSelectedCategories(prev => prev.filter(id => id !== category.id));
                                } else {
                                  setSelectedCategories(prev => [...prev, category.id!]);
                                }
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            {category.slug && (
                              <div className="text-sm text-gray-500">{category.slug}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {category.description || 'No description'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {products.filter(p => p.category === category.name).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              category.isActive !== false
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setCategoryDialog({ isOpen: true, category })}
                              className="text-purple-600 hover:text-purple-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteDialog({ isOpen: true, type: 'category', item: category })}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Tags ({tags.length})</h2>
                  <div className="flex space-x-3">
                    {selectedTags.length > 0 && (
                      <button
                        onClick={handleBulkDeleteTags}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Selected ({selectedTags.length})</span>
                      </button>
                    )}
                    <button
                      onClick={() => setTagDialog({ isOpen: true, tag: null })}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedTags.length === tags.length && tags.length > 0}
                            onChange={() => {
                              if (selectedTags.length === tags.length) {
                                setSelectedTags([]);
                              } else {
                                setSelectedTags(tags.map(t => t.id!));
                              }
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tag
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Products
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
                      {tags.map((tag) => {
                        const productCount = products.filter(p => 
                          (p.tags || []).includes(tag.name)
                        ).length;
                        
                        return (
                          <tr key={tag.id} className={selectedTags.includes(tag.id!) ? 'bg-purple-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.id!)}
                                onChange={() => {
                                  if (selectedTags.includes(tag.id!)) {
                                    setSelectedTags(prev => prev.filter(id => id !== tag.id));
                                  } else {
                                    setSelectedTags(prev => [...prev, tag.id!]);
                                  }
                                }}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <span
                                  className="inline-flex px-3 py-1 text-sm font-medium rounded-full text-white"
                                  style={{ backgroundColor: tag.color || '#6366f1' }}
                                >
                                  {tag.name}
                                </span>
                                {tag.slug && (
                                  <span className="text-sm text-gray-500">{tag.slug}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {productCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                tag.isActive !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {tag.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setTagDialog({ isOpen: true, tag })}
                                className="text-purple-600 hover:text-purple-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteDialog({ isOpen: true, type: 'tag', item: tag })}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <OrderManagement />
            )}

            {activeTab === 'reviews' && (
              <ReviewManagement />
            )}

            {activeTab === 'users' && (
              <UserManagement />
            )}

            {activeTab === 'seo' && (
              <SitemapGenerator />
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
        <ProductDialog
          isOpen={editDialog.isOpen}
          onClose={() => setEditDialog({ isOpen: false, product: null })}
          onSave={handleProductDialog}
          product={editDialog.product}
          categories={categoryNames}
          tags={tagNames}
          loading={actionLoading}
          uploadProductImage={handleUploadImage}
        />

        {/* Category Dialog */}
        <CategoryDialog
          isOpen={categoryDialog.isOpen}
          onClose={() => setCategoryDialog({ isOpen: false, category: null })}
          onSave={categoryDialog.category ? handleUpdateCategory : handleCreateCategory}
          category={categoryDialog.category}
          categories={categories}
          loading={actionLoading}
        />

        {/* Tag Dialog */}
        <TagDialog
          isOpen={tagDialog.isOpen}
          onClose={() => setTagDialog({ isOpen: false, tag: null })}
          onSave={tagDialog.tag ? handleUpdateTag : handleCreateTag}
          tag={tagDialog.tag}
          loading={actionLoading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, type: 'category', item: null })}
          onConfirm={() => {
            if (deleteDialog.type === 'category' && deleteDialog.item) {
              handleDeleteCategory(deleteDialog.item.id!);
            }
          }}
          title={`Delete ${deleteDialog.type === 'category' ? 'Category' : 'Tag'}`}
          message={`Are you sure you want to delete "${deleteDialog.item?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
          loading={actionLoading}
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