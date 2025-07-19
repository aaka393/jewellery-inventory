import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import Dialog from './Dialog';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  category?: Category | null;
  categories: Category[];
  loading?: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  categories,
  loading = false
}) => {
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    slug: '',
    image: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        image: category.image || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        image: '',
      });
    }
  }, [category, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    onSave(formData);
  };

  // Filter out current category from parent options to prevent circular reference
  const availableParentCategories = categories.filter(cat => 
    cat.id !== category?.id
  );

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={category ? 'Edit Category' : 'Create Category'} 
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="category-slug"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;