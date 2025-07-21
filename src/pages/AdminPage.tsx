import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  Trash2
} from 'lucide-react';
import { Product, Category, ProductImport } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductDialog from '../components/admin/ProductDialog';
import NotificationToast from '../components/admin/NotificationToast';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG, staticImageBaseUrl } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';

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

  console.log("products",products)
  // Dialog states
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null
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

  const handleProductDialog = async (productData: Partial<Product>) => {
    setActionLoading(true);
    try {
      if (productData.id) {
        // Update existing product
        await apiService.updateProduct(productData.id, productData);
        showNotification('Product updated successfully!', 'success');
      } else {
        // Type guard to ensure required fields exist
        if (
          productData.name &&
          productData.category &&
          typeof productData.price === 'number' &&
          typeof productData.initialPrice === 'number'
        ) {
          const productToCreate: ProductImport = {
            name: productData.name,
            slug: productData.slug,
            category: productData.category,
            description: productData.description,
            price: productData.price,
            initialPrice: productData.initialPrice,
            comparePrice: productData.comparePrice,
            images: productData.images,
            stock: productData.stock,
          };

          await apiService.createProduct(productToCreate);
          showNotification('Product created successfully!', 'success');
        } else {
          throw new Error('Missing required product fields for creation.');
        }
      }

      await loadData();
      setEditDialog({ isOpen: false, product: null });
    } catch (error) {
      console.error('Error updating/creating product:', error);
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
      showNotification('Category created successfully!', 'success');
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('Error creating category', 'error');
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

      <div className="flex min-h-screen bg-[#f5e9dc] text-[#5f3c2c] font-serif">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 bg-[#D4B896] shadow-sm lg:min-h-screen lg:sticky lg:top-0 border-r border-[#e2cbb5]">
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
            </div>

            <nav className="mt-4 lg:mt-6">
              {/* Mobile: Horizontal scroll, Desktop: Vertical */}
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 space-x-2 lg:space-x-0 lg:space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center px-3 lg:px-6 py-2 lg:py-3 text-left hover:bg-[#e5cfb5] whitespace-nowrap rounded-lg lg:rounded-none transition-colors ${activeTab === tab.id
                        ? 'bg-[#e5cfb5] text-[#5f3c2c] lg:border-r-2 lg:border-[#5f3c2c] shadow-sm lg:shadow-none'
                        : 'text-[#5f3c2c]'
                      }`}
                  >
                    <tab.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2 lg:mr-3" />
                    <span className="text-sm lg:text-base">{tab.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10 mt-20 bg-[#f5e9dc]">
            {activeTab === 'dashboard' && <AdminDashboard />}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-4xl font-bold">
                    Products <span className="text-[#d2b79f] text-2xl">({products.length})</span>
                  </h2>
                  <div className="space-x-4">
                    <button
                      onClick={() => setEditDialog({ isOpen: true, product: null })}
                      className="bg-[#d2b79f] text-[#4d2e1f] px-5 py-2 rounded-md shadow hover:opacity-90 transition"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: 'bulk',
                          item: null,
                        })
                      }
                      className="border border-[#d2b79f] text-[#4d2e1f] px-5 py-2 rounded-md hover:bg-[#f0dfcc] transition"
                    >
                      Delete All Products
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full divide-y divide-[#dec8b0]">
                      <thead className="bg-[#f5e9dc]">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                            Product
                          </th>
                          <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                            Price
                          </th>
                          <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#eadacd]">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-3 py-4 flex items-center">
                              <img
                                src={
                                  product.images?.[0]?.startsWith('http')
                                    ? product.images[0]
                                    : `${staticImageBaseUrl}/${product.images[0]}` ||
                                    'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'
                                }
                                alt={product.name}
                                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="ml-2 min-w-0 flex-1">
                                <div className="text-xs sm:text-sm font-medium text-[#5f3c2c] truncate max-w-[120px] sm:max-w-none">
                                  {product.name}
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 py-4 text-xs text-[#5f3c2c]">
                              {product.category}
                            </td>
                            <td className="px-3 py-4 text-xs font-medium text-[#5f3c2c]">
                              ₹{(product.price || 0).toLocaleString()}
                            </td>
                            <td className="hidden md:table-cell px-3 py-4 text-xs font-medium text-[#5f3c2c]">
                              {product.stock ?? 0}
                            </td>

                            <td className="px-3 py-4 text-xs font-medium">
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => setEditDialog({ isOpen: true, product })}
                                  className="text-[#d2b79f] hover:text-[#5f3c2c] text-left"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteDialog({
                                      isOpen: true,
                                      type: 'product',
                                      item: product,
                                      productId: product.id,
                                      productName: product.name,
                                    })
                                  }
                                  className="text-red-600 hover:text-red-900 text-left"
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


            {activeTab === 'categories' && (
              <CategoryManagement />
            )}

            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#5f3c2c]">Settings</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-[#5f3c2c]">Settings panel coming soon...</p>
                </div>
              </div>
            )}
          </main>
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
            deleteDialog.type === 'bulk'
              ? 'Delete All Products'
              : deleteDialog.type === 'product'
                ? 'Delete Product'
                : `Delete Category`
          }
          message={
            deleteDialog.type === 'bulk'
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
          onClose={() => setNotification((prev) => ({ ...prev, isVisible: false }))}
        />
      </div>
    </>
  );

};

export default AdminPage;