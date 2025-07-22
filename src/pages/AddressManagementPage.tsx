import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddressSelector from '../components/address/AddressSelector';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import Header from '../components/common/Header';

const AddressManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title={`Manage Addresses - ${SITE_CONFIG.name}`}
        description="Manage your delivery addresses for jewelry orders"
      />

      {/* Header should be outside the inner layout */}
      <Header />

      <main className="min-h-screen mt-10 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-[#4A3F36] hover:text-gray-800 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#4A3F36]">
              Manage Addresses
            </h1>
            <div className="w-8" />
          </div>

          <div className="bg-gray-50 rounded-xl shadow p-6 sm:p-8">
            <AddressSelector showTitle={false} />
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressManagementPage;
