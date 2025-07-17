import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductFilters } from '../../types';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['price', 'tags']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const priceRanges = [
    { label: 'Under ₹10K', min: 0, max: 10000 },
    { label: '₹10K - ₹20K', min: 10000, max: 20000 },
    { label: '₹20K - ₹30K', min: 20000, max: 30000 },
    { label: '₹30K - ₹50K', min: 30000, max: 50000 },
    { label: '₹50K - ₹75K', min: 50000, max: 75000 },
    { label: 'Above ₹75K', min: 75000, max: Infinity },
  ];

  const availableTags = ['bestseller', 'trending', 'new in', 'featured'];

  const handlePriceChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      price_min: min,
      price_max: max === Infinity ? undefined : max,
    });
  };

  const handleTagChange = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    z-50
    w-80 bg-white shadow-lg
    lg:relative lg:z-auto lg:h-auto
    ${isOpen ? 'fixed inset-0 lg:inset-auto h-full' : 'hidden lg:block'}
  `}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Price Filter */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">Price</span>
              {expandedSections.includes('price') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.includes('price') && (
              <div className="px-4 pb-4">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center space-x-2 py-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.price_min === range.min && filters.price_max === range.max}
                      onChange={() => handlePriceChange(range.min, range.max)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tags Filter */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('tags')}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">Tags</span>
              {expandedSections.includes('tags') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.includes('tags') && (
              <div className="px-4 pb-4">
                {availableTags.map((tag) => (
                  <label key={tag} className="flex items-center space-x-2 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(filters.tags || []).includes(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Discounts Filter */}
          <div className="border-b">
            <button
              onClick={() => toggleSection('discounts')}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">Discounts</span>
              {expandedSections.includes('discounts') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.includes('discounts') && (
              <div className="px-4 pb-4">
                <label className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Flat 30% off on Diamond Prices</span>
                </label>
                <label className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Flat 15% off on Making Charges</span>
                </label>
                <label className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Flat 10% off on Making Charges</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;