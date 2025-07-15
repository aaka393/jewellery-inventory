import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Gem, Trash2, RefreshCw } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useAdminStore } from '../stores/adminStore'; // ✅ NEW
import { TableData } from '../types';
import DataTable from '../components/DataTable';

interface DataPageProps {
  data: TableData[];
}

const DataPage: React.FC<DataPageProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const { fetchProducts, isLoading } = useProductStore();
  const { deleteAllProducts, fetchProducts: refreshAdminProducts } = useAdminStore(); // ✅ NEW

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm.toLowerCase());
    
    const availability = item.inStock ? 'In Stock' : 'Out of Stock';
    const matchesFilter = filterAvailability === '' || availability === filterAvailability;
    
    return matchesSearch && matchesFilter;
  });

  const availabilityOptions = ['In Stock', 'Out of Stock'];

  const handleClearAllProducts = async () => {
    if (window.confirm('Are you sure you want to clear all jewelry products? This action cannot be undone.')) {
      await deleteAllProducts(); // ✅ Call backend to delete products
      await fetchProducts();     // ✅ Refresh UI after deletion
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gem className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Jewelry Inventory</h1>
                <p className="text-purple-100 mt-1">
                  {isLoading ? 'Loading...' : `${data.length} jewelry items in stock`}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Inventory
              </button>
              
              {data.length > 0 && (
                <button 
                  onClick={handleClearAllProducts}
                  className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jewelry items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jewelry inventory...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jewelry Items</h3>
              <p className="text-gray-600 mb-4">Import jewelry inventory from the admin page to see your items here.</p>
              <button
                onClick={handleRefresh}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <DataTable data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPage;