import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ShoppingCart, Plus } from 'lucide-react';
import { TableData } from '../types';
import ImageModal from './ImageModal';
import { useCart } from '../context/CartContext';

interface DataTableProps {
  data: TableData[];
}

type SortKey = keyof TableData;
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('description');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedImage, setSelectedImage] = useState<{ url: string; description: string } | null>(null);
  const { addToCart } = useCart();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey].toLowerCase();
    const bVal = b[sortKey].toLowerCase();
    
    if (sortKey === 'price') {
      const aNum = parseFloat(aVal.replace(/[^0-9.-]+/g, ''));
      const bNum = parseFloat(bVal.replace(/[^0-9.-]+/g, ''));
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    }
    
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getAvailabilityColor = (availability: string) => {
    const status = availability.toLowerCase();
    if (status.includes('in stock') || status.includes('available')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (status.includes('limited') || status.includes('low')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (status.includes('out') || status.includes('unavailable')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const openImageModal = (imageUrl: string, description: string) => {
    setSelectedImage({ url: imageUrl, description });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleAddToCart = (item: TableData) => {
    if (item.availability.toLowerCase().includes('out') || item.availability.toLowerCase().includes('unavailable')) {
      return; // Don't add out of stock items
    }
    addToCart(item);
  };

  const isOutOfStock = (availability: string) => availability.toLowerCase().includes('out') || availability.toLowerCase().includes('unavailable');

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No jewelry items match your current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={() => handleSort('description')}
            >
              <div className="flex items-center space-x-1">
                <span>Description</span>
                {getSortIcon('description')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center space-x-1">
                <span>Price</span>
                {getSortIcon('price')}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              onClick={() => handleSort('availability')}
            >
              <div className="flex items-center space-x-1">
                <span>Availability</span>
                {getSortIcon('availability')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-purple-600">{item.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getAvailabilityColor(item.availability)}`}>
                  {item.availability}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.image ? (
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.image}
                      alt={item.description}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => openImageModal(item.image, item.description)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                      }}
                    />
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={isOutOfStock(item.availability)}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isOutOfStock(item.availability)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md'
                  }`}
                  title={isOutOfStock(item.availability) ? 'Out of stock' : 'Add to cart'}
                >
                  {isOutOfStock(item.availability) ? (
                    <Plus className="h-4 w-4 mr-1" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-1" />
                  )}
                  {isOutOfStock(item.availability) ? 'Unavailable' : 'Add to Cart'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
          description={selectedImage.description}
        />
      )}
    </div>
  );
};

export default DataTable;