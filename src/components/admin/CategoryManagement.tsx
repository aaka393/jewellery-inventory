import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, X, Upload } from 'lucide-react';
import { Category } from '../../types';
import { apiService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import Dialog from '../common/Dialog';
import { staticImageBaseUrl } from '../../constants/siteConfig';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState<{
    isOpen: boolean;
    category: Category | null;
    mode: 'create' | 'edit';
  }>({
    isOpen: false,
    category: null,
    mode: 'create'
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    categoryId?: string;
    categoryName?: string;
  }>({
    isOpen: false,
    type: 'single'
  });

  // Form states
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    image: '',
    parentId: ''
  });
  const [isMainCategory, setIsMainCategory] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryDialog.isOpen) {
      if (categoryDialog.mode === 'edit' && categoryDialog.category) {
        setFormData({
          name: categoryDialog.category.name || '',
          slug: categoryDialog.category.slug || '',
          image: categoryDialog.category.image || '',
          parentId: categoryDialog.category.parentId || ''
        });
        setIsMainCategory(!categoryDialog.category.parentId);

        // Set existing image if available
        if (categoryDialog.category.image) {
          setImageFiles([{
            id: 'existing',
            file: null as any,
            preview: categoryDialog.category.image,
            uploaded: true,
            url: categoryDialog.category.image
          }]);
        }
      } else {
        // Reset form for create mode
        setFormData({ name: '', slug: '', image: '', parentId: '' });
        setIsMainCategory(false);
        setImageFiles([]);
      }
    }
  }, [categoryDialog]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: prev.slug || generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsMainCategory(checked);
    
    if (checked) {
      // Clear parent category when marking as main category
      setFormData(prev => ({ ...prev, parentId: '' }));
    }
  };

  // Get available parent categories (excluding current category and its descendants)
  const getAvailableParentCategories = () => {
    if (categoryDialog.mode === 'create') {
      return categories;
    }
    
    // For edit mode, exclude current category and its potential descendants
    const currentCategoryId = categoryDialog.category?.id;
    return categories.filter(category => category.id !== currentCategoryId);
  };

  // Image handling functions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      // Only allow one image for categories
      const file = imageFiles[0];
      const newImageFile: ImageFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        uploaded: false
      };

      setImageFiles([newImageFile]);
    }
  };

  const removeImage = () => {
    setImageFiles([]);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const uploadImage = async (): Promise<string> => {
    if (imageFiles.length === 0) {
      return formData.image ?? ''; // Return existing image URL if no new image, or empty string if undefined
    }

    const imageFile = imageFiles[0];
    if (imageFile.uploaded && imageFile.url) {
      return imageFile.url;
    }

    if (imageFile.file) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', imageFile.file);

        const response = await fetch('/api/auth/upload-file', {
          method: 'POST',
          body: formDataUpload,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const result = await response.json();
        if (result.code === 2011 && result.result) {
          return `${result.result}`;
        } else {
          throw new Error('Invalid upload response');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(formData.name ?? '').trim()) {
      alert('Category name is required');
      return;
    }

    try {
      setUploading(true);
      setActionLoading(true);

      // Upload image if needed
      const imageUrl = await uploadImage();

      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name ?? ''),
        image: imageUrl || formData.image,
        parentId: formData.parentId || ''
      };

      if (categoryDialog.mode === 'edit' && categoryDialog.category) {
        // Update category (when API is available)
        await apiService.updateCategory(categoryDialog.category.id, categoryData);
        console.log('Update category:', categoryData);
      } else {
        // Create new category
        await apiService.createCategory(categoryData);
      }

      await loadCategories();
      setCategoryDialog({ isOpen: false, category: null, mode: 'create' });

    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setUploading(false);
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setActionLoading(true);
      await apiService.deleteCategory(categoryId);
      await loadCategories();
      setDeleteDialog({ isOpen: false, type: 'single' });
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setActionLoading(true);
      await Promise.all(selectedCategories.map(id => apiService.deleteCategory(id)));
      setSelectedCategories([]);
      await loadCategories();
      setDeleteDialog({ isOpen: false, type: 'bulk' });
    } catch (error) {
      console.error('Error bulk deleting categories:', error);
      alert('Failed to delete categories. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id!));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const availableParentCategories = getAvailableParentCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#5f3c2c]">
          Categories ({categories.length})
        </h2>
        <div className="flex space-x-3">
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setDeleteDialog({ isOpen: true, type: 'bulk' })}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedCategories.length})</span>
            </button>
          )}
          <button
            onClick={() => setCategoryDialog({ isOpen: true, category: null, mode: 'create' })}
            className="bg-[#d2b79f] text-[#4d2e1f] px-4 py-2 rounded-lg font-semibold hover:bg-[#f0dfcc] flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-[#dec8b0]">
            <thead className="bg-[#f5e9dc]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === categories.length && categories.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[#d2b79f] text-[#5f3c2c]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#5f3c2c] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#eadacd]">
              {categories.map((category) => {
                const parentCategory = categories.find(c => c.id === category.parentId);
                return (
                  <tr
                    key={category.id}
                    className={selectedCategories.includes(category.id!) ? 'bg-[#e5cfb5]' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id!)}
                        onChange={() => handleSelectCategory(category.id!)}
                        className="rounded border-[#d2b79f] text-[#5f3c2c]"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        <img
                          src={`${staticImageBaseUrl}/${category.image}`}
                          alt={category.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#5f3c2c]">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8f674b]">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8f674b]">
                        {parentCategory ? parentCategory.name : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCategoryDialog({ isOpen: true, category, mode: 'edit' })}
                          className="text-[#d2b79f] hover:text-[#5f3c2c]"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({
                            isOpen: true,
                            type: 'single',
                            categoryId: category.id,
                            categoryName: category.name
                          })}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Form Dialog */}
      <Dialog
        isOpen={categoryDialog.isOpen}
        onClose={() => setCategoryDialog({ isOpen: false, category: null, mode: 'create' })}
        title={categoryDialog.mode === 'edit' ? 'Edit Category' : 'Create Category'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                placeholder="category-slug"
              />
            </div>
          </div>

          {/* Parent Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
              Parent Category
            </label>
            <select
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              disabled={isMainCategory}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent bg-white"
            >
              <option value="">Select parent category (optional)</option>
              {availableParentCategories.length > 0 ? (
                availableParentCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
            
            {/* Main Category Checkbox */}
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="isMainCategory"
                checked={isMainCategory}
                onChange={handleMainCategoryChange}
                className="h-4 w-4 text-[#D4B896] focus:ring-[#D4B896] border-gray-300 rounded"
              />
            </div>
            
            <p className="text-xs text-[#8f674b] mt-1">
              {isMainCategory 
                ? "Is Parent Category"
                : "Leave parent empty to create a top-level category, or select a parent for subcategory"
              }
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
              Category Image
            </label>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive
                ? 'border-[#D4B896] bg-[#F2E9D8]'
                : 'border-gray-300 hover:border-[#D4B896] hover:bg-gray-50'
                }`}
            >
              <Upload className="h-8 w-8 text-[#5f3c2c] mx-auto mb-2" />
              <p className="text-sm text-[#5f3c2c]">
                Drag and drop an image here, or <span className="text-[#D4B896]">click to browse</span>
              </p>
              <p className="text-xs text-[#D4B896] mt-1">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {/* Image Preview */}
            {imageFiles.length > 0 && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={imageFiles[0].preview}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute top-1 left-1">
                    {imageFiles[0].uploaded ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Uploaded" />
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Pending upload" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setCategoryDialog({ isOpen: false, category: null, mode: 'create' })}
              disabled={actionLoading || uploading}
              className="flex-1 px-4 py-2 text-[#5f3c2c] bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || uploading}
              className="flex-1 px-4 py-2 bg-[#D4B896] text-white rounded-lg hover:bg-[#B79B7D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>{categoryDialog.mode === 'edit' ? 'Update Category' : 'Create Category'}</span>
              )}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: 'single' })}
        onConfirm={deleteDialog.type === 'single'
          ? () => handleDeleteCategory(deleteDialog.categoryId!)
          : handleBulkDelete
        }
        title={deleteDialog.type === 'single' ? 'Delete Category' : 'Delete Categories'}
        message={deleteDialog.type === 'single'
          ? `Are you sure you want to delete "${deleteDialog.categoryName}"? This action cannot be undone.`
          : `Are you sure you want to delete ${selectedCategories.length} selected categories? This action cannot be undone.`
        }
        confirmText="Delete"
        type="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default CategoryManagement;