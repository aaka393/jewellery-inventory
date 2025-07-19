import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Upload, 
  Users, 
  ShoppingCart,
  Settings,
  FileText,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../services/api';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import CSVUploader from '../components/admin/CSVUploader';
import ProductDialog from '../components/admin/ProductDialog';
import NotificationToast from '../components/admin/NotificationToast';
import CategoryDialog from '../components/common/CategoryDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'category' | 'product' | 'bulk';
    item: Category | Product | null;
    productId?: string;
    productName?: string;
  }>({
    isOpen: false,
    type: 'product',
    item: null
  });

  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts(productsRes || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setProducts([]);
      setCategories([]);
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
    setActionLoading(true);
    try {
      if (productData.id) {
        // Update existing product
        await apiService.updateProduct(productData.id, productData);
        showNotification('Product updated successfully!', 'success');
      } else {
         await apiService.createProduct(productData);
      showNotification('Product created successfully!', 'success');
      }
      await loadData();
      setEditDialog({ isOpen: false, product: null });
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification(productData.id ? 'Error updating product' : 'Error creating product', 'error');
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

  const handleDeleteAllProducts = async () => {
    try {
      setActionLoading(true);
      await apiService.deleteProducts();
      await loadData();
      showNotification('All products deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting all products:', error);
      showNotification('Error deleting all products', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSingleProduct = async (productId: string) => {
    try {
      setActionLoading(true);
      await apiService.deleteProductById(productId);
      await loadData();
      setDeleteDialog({ isOpen: false, type: 'product', item: null });
      showNotification('Product deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'upload', label: 'Bulk Upload', icon: Upload },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  const categoryNames = categories.map(cat => cat.name);

  return (
    <>
      <SEOHead
        title={`Admin Dashboard - ${SITE_CONFIG.name}`}
        description="Manage your jewelry store inventory, orders, and settings"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-white shadow-sm lg:min-h-screen lg:sticky lg:top-0">
            <div className="p-4 lg:p-6">
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-600">{SITE_CONFIG.name}</p>
            </div>
            
            <nav className="mt-4 lg:mt-6">
              {/* Mobile: Horizontal scroll, Desktop: Vertical */}
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 space-x-2 lg:space-x-0 lg:space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center px-3 lg:px-6 py-2 lg:py-3 text-left hover:bg-gray-50 whitespace-nowrap rounded-lg lg:rounded-none transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-600 lg:border-r-2 lg:border-purple-600 shadow-sm lg:shadow-none'
                      : 'text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3" />
                  <span className="text-sm lg:text-base">{tab.label}</span>
                </button>
              ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-8 min-h-screen bg-gray-50">
            {activeTab === 'dashboard' && <AdminDashboard />}
            
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Products ({products.length})</h2>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4">
                    <button
                      onClick={() => setEditDialog({ isOpen: true, product: null })}
                      className="bg-green-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 text-sm md:text-base whitespace-nowrap"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ 
                        isOpen: true, 
                        type: 'bulk', 
                        item: null 
                      })}
                      className="bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-red-700 text-sm md:text-base whitespace-nowrap"
                    >
                      Delete All Products
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="hidden sm:table-cell px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="hidden md:table-cell px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-2 sm:px-3 md:px-6 py-4">
                              <div className="flex items-center">
                                <img
                                  src={product.images?.[0]?.startsWith('http') 
                                    ? product.images[0] 
                                    : `/api/static/images/${product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                                  alt={product.name}
                                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="ml-1 sm:ml-2 md:ml-4 min-w-0 flex-1">
                                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate sm:hidden max-w-[120px]">
                                    {product.category}
                                  </div>
                                  <div className="hidden sm:block text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">
                                    {product.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                              {product.category}
                            </td>
                            <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-900">
                              {SITE_CONFIG.currencySymbol}{(product.price || 0).toLocaleString()}
                            </td>
                            <td className="hidden md:table-cell px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.stock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.stock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-xs font-medium">
                              <div className="flex flex-col gap-1">
                                <button 
                                  onClick={() => setEditDialog({ isOpen: true, product })}
                                  className="text-purple-600 hover:text-purple-900 text-left text-xs"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => setDeleteDialog({ 
                                    isOpen: true, 
                                    type: 'product', 
                                    item: product,
                                    productId: product.id,
                                    productName: product.name
                                  })}
                                  className="text-red-600 hover:text-red-900 text-left text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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

            {activeTab === 'orders' && (
              <OrderManagement />
            )}

            {activeTab === 'users' && (
              <UserManagement />
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
          mode={editDialog.product ? 'edit' : 'add'}
          categories={categoryNames}
          loading={actionLoading}
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

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, type: 'product', item: null })}
          onConfirm={() => {
            if (deleteDialog.type === 'category' && deleteDialog.item) {
              handleDeleteCategory(deleteDialog.item.id!);
            } else if (deleteDialog.type === 'product' && deleteDialog.productId) {
              handleDeleteSingleProduct(deleteDialog.productId);
            } else if (deleteDialog.type === 'bulk' && deleteDialog.item === null) {
              handleDeleteAllProducts();
            }
          }}
          title={
            deleteDialog.type === 'bulk' ? 'Delete All Products' : 
            deleteDialog.type === 'product' ? 'Delete Product' :
            `Delete Category`
          }
          message={deleteDialog.type === 'bulk' 
            ? 'Are you sure you want to delete ALL products? This action cannot be undone and will remove all product data permanently.'
            : deleteDialog.type === 'product'
            ? `Are you sure you want to delete "${deleteDialog.productName}"? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteDialog.item?.name}"? This action cannot be undone.`
          }
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