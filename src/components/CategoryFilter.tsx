import React from 'react';
import { Gem, Diamond, Coins, Award } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | null;
  onCategoryChange: (category: ProductCategory | null) => void;
}

const categories = [
  { id: null, name: 'All', icon: Gem, color: 'text-gray-600' },
  { id: 'Gold' as ProductCategory, name: 'Gold', icon: Coins, color: 'text-yellow-600' },
  { id: 'Silver' as ProductCategory, name: 'Silver', icon: Award, color: 'text-gray-500' },
  { id: 'Diamond' as ProductCategory, name: 'Diamond', icon: Diamond, color: 'text-blue-600' },
  { id: 'Platinum' as ProductCategory, name: 'Platinum', icon: Gem, color: 'text-purple-600' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }
              `}
            >
              <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-purple-600' : category.color}`} />
              <span className={`text-sm font-medium ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;