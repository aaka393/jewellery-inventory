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
import Header from '../components/common/Header';

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
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEOHead
        title={`Admin Dashboard - ${SITE_CONFIG.name}`}
        description="Manage your jewelry store inventory, orders, and settings"
      />

      <Header /> {/* ✅ Always render header */}

      <div className="flex min-h-screen bg-[#f5e9dc] text-[#5f3c2c] font-serif pt-[64px]"> {/* ✅ Push below header */}
        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 bg-[#D4B896] shadow-sm lg:min-h-screen lg:sticky lg:top-[64px] border-r border-[#e2cbb5]">
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-1">Admin Panel</h1>
            </div>

            <nav className="mt-4 lg:mt-6">
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 space-x-2 lg:space-x-0 lg:space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 lg:w-full flex items-center px-3 lg:px-6 py-2 lg:py-3 text-left hover:bg-[#e5cfb5] whitespace-nowrap rounded-lg lg:rounded-none transition-colors ${
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
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10 bg-[#f5e9dc]">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'categories' && <CategoryManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'users' && <UserManagement />}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
