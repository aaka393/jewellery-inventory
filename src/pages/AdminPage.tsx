import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  FileText,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import CategoryManagement from '../components/admin/CategoryManagement';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

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

      {/* Main Layout Container */}
      <div className="min-h-screen bg-[#f5e9dc] text-[#5f3c2c] font-serif pt-16 sm:pt-20 flex flex-col lg:flex-row">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 xl:w-72 bg-[#f5e9dc] border-t lg:border-t-0 lg:border-r border-[#e2cbb5] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] z-20 overflow-x-auto lg:overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 lg:mb-4">Admin Panel</h1>

           <nav>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 space-x-1 sm:space-x-2 lg:space-x-0 lg:space-y-1 xl:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:w-full flex items-center px-2 sm:px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 xl:py-3 text-left hover:bg-[#e5cfb5] whitespace-nowrap rounded-md lg:rounded-lg transition-colors focus:outline-none focus:ring-0 ${
                  activeTab === tab.id
                    ? 'bg-[#e5cfb5] text-[#5f3c2c] lg:border-r-2 lg:border-[#5f3c2c] shadow-sm lg:shadow-none'
                    : 'text-[#5f3c2c]'
                }`}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 lg:mr-3" />
                <span className="text-xs sm:text-sm lg:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

          </div>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 px-3 sm:px-4 lg:px-6 pb-6 sm:pb-8 overflow-y-auto lg:mt-0"
        >
          <div className="lg:hidden h-32 sm:h-40"></div> {/* Spacer for mobile sidebar */}
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
        </main>
      </div>
    </>
  );
};

export default AdminPage;
