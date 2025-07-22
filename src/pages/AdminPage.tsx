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
      <div className="h-screen bg-[#f5e9dc] text-[#5f3c2c] font-serif pt-[64px] flex flex-col lg:flex-row overflow-hidden">

        {/* Sidebar */}
        <aside className="w-full lg:w-60 bg-[#f5e9dc] border-t lg:border-t-0 lg:border-r border-[#e2cbb5] fixed lg:fixed top-[64px] left-0 lg:h-[calc(100vh-64px)] z-20 overflow-x-auto lg:overflow-y-auto">
          <div className="p-4 lg:p-6">
            <h1 className="text-xl lg:text-2xl font-semibold mb-2">Admin Panel</h1>

           <nav>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 space-x-2 lg:space-x-0 lg:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:w-full flex items-center px-3 lg:px-6 py-2 lg:py-3 text-left hover:bg-[#e5cfb5] whitespace-nowrap rounded-lg lg:rounded-none transition-colors focus:outline-none focus:ring-0 ${
                  activeTab === tab.id
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

          </div>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 px-4 lg:px-6 pb-8 overflow-y-auto mt-[240px] lg:mt-[64px] lg:ml-60"
          style={{ height: 'calc(100vh - 240px)' }} // Mobile scroll fix
        >
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
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
    </>
  );
};

export default AdminPage;
