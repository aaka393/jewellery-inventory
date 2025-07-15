import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  productCounts: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  productCounts 
}) => {
  // Get unique categories from productCounts, plus 'All'
  const categories = ['All', ...Object.keys(productCounts).filter(cat => cat !== 'All')];

  const formatCategoryName = (category: string) => {
    if (category === 'All') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category as Category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            {formatCategoryName(category)} ({productCounts[category] || 0})
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;