import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import UserMenu from '../components/common/UserMenu';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEOHead
        title={`Admin Dashboard - ${SITE_CONFIG.name}`}
        description="Manage your jewelry store inventory, orders, and settings"
      />

      {/* Main Layout */}
      <div className="min-h-screen bg-[#F6F5F1] text-[#5f3c2c] font-serif">
        <div className="flex ">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 xl:w-72 
            bg-white border-r border-[#e2cbb5] shadow-lg lg:shadow-none
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col h-screen
          `}>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 lg:p-6">
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h1 className="text-xl font-semibold">Admin Panel</h1>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <h1 className="hidden lg:block text-lg xl:text-2xl font-semibold mb-4">Admin Panel</h1>

                <nav>
                  <div className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-[#e5cfb5] rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                          activeTab === tab.id
                            ? 'bg-[#e5cfb5] text-[#5f3c2c] border-r-2 border-[#5f3c2c]'
                            : 'text-[#5f3c2c]'
                        }`}
                      >
                        <tab.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>

            <div className="p-4 border-t border-[#e2cbb5]">
              <UserMenu />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-[#e2cbb5] p-4 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {activeTab === 'dashboard' && <AdminDashboard />}
              {activeTab === 'products' && <ProductManagement />}
              {activeTab === 'categories' && <CategoryManagement />}
              {activeTab === 'orders' && <OrderManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#5f3c2c]">Settings</h2>
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <p className="text-[#5f3c2c]">Settings panel coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;