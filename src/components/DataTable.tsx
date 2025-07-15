import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShoppingCart,
  Plus,
} from 'lucide-react';
import { TableData } from '../types';
import ImageModal from './ImageModal';
import { useCartStore } from '../stores/cartStore';

interface DataTableProps {
  data: TableData[];
}

type SortKey = 'description' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [sortKey, setSortKey] = useState<SortKey>('description');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedImage, setSelectedImage] = useState<{ url: string; description: string } | null>(null);

  const addToCart = useCartStore((state) => state.addItem);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = (a[sortKey] ?? '').toString().toLowerCase();
    const bVal = (b[sortKey] ?? '').toString().toLowerCase();

    if (sortKey === 'price') {
      const aNum = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
      const bNum = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return sortOrder === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortOrder === 'asc'
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const openImageModal = (imageUrl: string, description: string) => {
    setSelectedImage({ url: imageUrl, description });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleAddToCart = (item: TableData) => {
    addToCart(item);
  };

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
            <th onClick={() => handleSort('description')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-1">
                <span>Description</span>
                {getSortIcon('description')}
              </div>
            </th>
            <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-1">
                <span>Price</span>
                {getSortIcon('price')}
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
          {sortedData.map((item, index) => {
            const image = item.images?.[0] ?? 'https://via.placeholder.com/48x48?text=No+Image';

            return (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-purple-600">₹{item.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <img
                      src={image}
                      alt={item.description}
                      className="h-12 w-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => openImageModal(image, item.description)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                      }}
                    />
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md transition-all duration-200"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
