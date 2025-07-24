import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import Dialog from '../common/Dialog';
import { Upload, X, Move, Eye } from 'lucide-react';
import { staticImageBaseUrl } from '../../constants/siteConfig';
import { apiService } from '../../services/api';
import { Category } from '../../types';

interface ProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product: Product | null;
    categories: string[];
    loading?: boolean;
    mode?: 'add' | 'edit';
    uploadProductImage?: (file: File) => Promise<string | null>;
}

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
}

interface ProductFormData {
    name: string;
    slug: string;
    parentCategory: string;
    category: string;
    description: string;
    initialPrice: number;
    price: number;
    comparePrice: number;
    images: string[];
    stock: boolean;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
    loading = false,
    mode = 'edit',
}) => {
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        slug: '',
        parentCategory: '',
        category: '',
        description: '',
        initialPrice: 0,
        price: 0,
        comparePrice: 0,
        images: [],
        stock: true,
    });

    // Load all categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await apiService.getCategories();
                setAllCategories(response || []);
            } catch (error) {
                console.error('Error loading categories:', error);
                setAllCategories([]);
            }
        };
        
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'add') {
                // Reset form for add mode
                setFormData({
                    name: '',
                    slug: '',
                    parentCategory: '',
                    category: '',
                    description: '',
                    initialPrice: 0,
                    price: 0,
                    comparePrice: 0,
                    images: [],
                    stock: true,
                });
                setImageFiles([]);
            }
        }
    }, [isOpen, mode]);

    useEffect(() => {
        if (product && mode === 'edit') {
            // Find the category object and its parent
            const productCategoryObj = allCategories.find(cat => cat.name === product.category);
            const parentCategoryId = productCategoryObj?.parentId || '';
            
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                parentCategory: parentCategoryId,
                category: product.category || '',
                description: product.description || '',
                initialPrice: product.initialPrice || 0,
                price: product.price || 0,
                comparePrice: product.comparePrice || 0,
                images: product.images || [],
                stock: product.stock ?? true,
            });

            // Convert existing images to ImageFile format for editing
            const existingImages: ImageFile[] = (product.images || []).map((url, index) => ({
                id: `existing-${index}`,
                file: null as any, // Existing images don't have files
                preview: url.startsWith('http') ? url : `${staticImageBaseUrl}/${url}`,
                uploaded: true,
                url: url
            }));
            setImageFiles(existingImages);
        }
    }, [product, mode, allCategories]);

    // Get parent categories (categories that are marked as parent categories - no parentId)
    const getParentCategories = () => {
        return allCategories.filter(cat => !cat.parentId);
    };

    // Get categories filtered by parent category (required filtering)
    const getFilteredCategoriesByParent = () => {
        if (!formData.parentCategory) {
            return []; // Return empty array if no parent is selected
        }
        return allCategories.filter(cat => cat.parentId === formData.parentCategory);
    };

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

        const newImageFiles: ImageFile[] = imageFiles.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            uploaded: false
        }));

        setImageFiles(prev => [...prev, ...newImageFiles]);
    };

    const removeImage = (id: string) => {
        setImageFiles(prev => {
            const updated = prev.filter(img => img.id !== id);
            // Revoke object URLs to prevent memory leaks
            const removed = prev.find(img => img.id === id);
            if (removed && !removed.uploaded) {
                URL.revokeObjectURL(removed.preview);
            }
            return updated;
        });
    };

    const reorderImages = (fromIndex: number, toIndex: number) => {
        setImageFiles(prev => {
            const updated = [...prev];
            const [removed] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, removed);
            return updated;
        });
    };

    const uploadImages = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];

        for (const imageFile of imageFiles) {
            if (imageFile.uploaded && imageFile.url) {
                // Already uploaded or existing image
                uploadedUrls.push(imageFile.url);
            } else if (imageFile.file) {
                // New image that needs uploading
                try {
                    const formData = new FormData();
                    formData.append('file', imageFile.file);

                    const response = await fetch('/api/auth/upload-file', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.code === 2011 && result.result) {
                        // Use the static mount URL format
                        const imageId = `${result.result}`;
                        uploadedUrls.push(imageId);
                    } else {
                        throw new Error('Invalid upload response');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    throw error;
                }
            }
        }

        return uploadedUrls;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name === 'parentCategory') {
            // Clear category when parent category changes
            setFormData(prev => ({
                ...prev,
                parentCategory: value,
                category: ''
            }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof ProductFormData] as any),
                    [child]: type === 'number' ? parseFloat(value) || 0 : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name?.trim()) {
            alert('Product name is required');
            return;
        }

        if (!formData.category?.trim()) {
            alert('Product category is required');
            return;
        }

        try {
            setUploading(true);

            // Upload images first
            const uploadedImageUrls = await uploadImages();

            // Get the category name from the selected category ID or use the category value directly
            const selectedCategory = allCategories.find(cat => cat.id === formData.category);
            const categoryName = selectedCategory ? selectedCategory.name : formData.category;

            // Prepare the final product data matching ProductImportModel
            const productData: any = {
                ...(mode === 'edit' && product?.id ? { id: product.id } : {}),
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                category: categoryName, // Use category name instead of ID
                description: formData.description,
                initialPrice: formData.initialPrice,
                price: formData.price,
                comparePrice: formData.comparePrice,
                images: uploadedImageUrls,
                stock: formData.stock,
            };

            onSave(productData);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={mode === 'add' ? 'Add New Product' : 'Edit Product'}
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Parent Category
                        </label>
                        <select
                            name="parentCategory"
                            value={formData.parentCategory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        >
                            <option value="">Select Parent Category (Optional)</option>
                            {getParentCategories().map(cat => (
                                <option key={cat.id} value={cat.id!}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.parentCategory}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        >
                            <option value="">
                                {!formData.parentCategory ? 'Select Parent Category First' : 'Select Category'}
                            </option>
                            {getFilteredCategoriesByParent().map(cat => (
                                <option key={cat.id} value={cat.id!}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Initial Price (Cost) *
                        </label>
                        <input
                            type="number"
                            name="initialPrice"
                            value={formData.initialPrice || ''}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Selling Price *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                            Compare Price
                        </label>
                        <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice || ''}
                            onChange={handleInputChange}
                            placeholder="Original price"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
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
                            placeholder="product-slug"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Product description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4B896] focus:border-transparent"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-[#5f3c2c] mb-2">
                        Product Images
                    </label>

                    {/* Drag and Drop Area */}
                    <div
                        ref={dragRef}
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
                            Drag and drop images here, or <span className="text-[#D4B896]">click to browse</span>
                        </p>
                        <p className="text-xs text-[#D4B896] mt-1">
                            Supports: JPG, PNG, GIF (Max 5MB each)
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    {/* Image Previews */}
                    {imageFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imageFiles.map((imageFile, index) => (
                                <div key={imageFile.id} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={imageFile.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Image Controls */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => reorderImages(index, index - 1)}
                                                className="p-1 bg-white rounded-full hover:bg-gray-100"
                                                title="Move left"
                                            >
                                                <Move className="h-3 w-3 rotate-180" />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => window.open(imageFile.preview, '_blank')}
                                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                                            title="Preview"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </button>

                                        {index < imageFiles.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => reorderImages(index, index + 1)}
                                                className="p-1 bg-white rounded-full hover:bg-gray-100"
                                                title="Move right"
                                            >
                                                <Move className="h-3 w-3" />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => removeImage(imageFile.id)}
                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            title="Remove"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>

                                    {/* Upload Status */}
                                    <div className="absolute top-1 left-1">
                                        {imageFile.uploaded ? (
                                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Uploaded" />
                                        ) : (
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Pending upload" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Toggle Switches */}
                <div className="grid grid-cols-1 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="stock"
                            checked={formData.stock}
                            onChange={handleCheckboxChange}
                            className="rounded border-gray-300 text-[#D4B896] focus:ring-[#D4B896]"
                        />
                        <span className="text-sm text-[#5f3c2c]">In Stock</span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading || uploading}
                        className="flex-1 px-4 py-2 text-[#5f3c2c] bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex-1 px-4 py-2 bg-[#D4B896] text-white rounded-lg hover:bg-[#B79B7D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <span>{mode === 'add' ? 'Create Product' : 'Save Changes'}</span>
                        )}
                    </button>
                </div>
            </form>
        </Dialog>

    );
};

export default ProductDialog;