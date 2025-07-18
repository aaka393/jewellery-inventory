import React, { useState, useEffect } from 'react';
import { Product, Specifications } from '../../types';
import Dialog from '../common/Dialog';
import { productService } from '../../services';

interface ProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product: Product | null;
    categories: string[];
    tags: string[];
    loading?: boolean;
    mode?: 'add' | 'edit';
    uploadProductImage?: (file: File) => Promise<string | null>;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
    tags,
    loading = false,
    mode = 'edit',
}) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category: '',
        description: '',
        price: undefined,
        images: [],
        tags: [],
        inStock: true,
        featured: false,
        noOfProducts: undefined,
        specifications: {},
        slug: '',
        comparePrice: undefined,
        preorderAvailable: false,
        rating: undefined,
        reviews: undefined,
        variants: {},
        visibility: true,
        sortOrder: undefined,
        viewCount: undefined,
        salesCount: undefined,
        stockAlert: undefined,
        dimensions: {
            length: undefined,
            width: undefined,
            height: undefined,
            weight: undefined,
        },
        seoKeywords: [],
        relatedProducts: [],
        metaTitle: '',
        metaDescription: '',
    });


    const [imageInput, setImageInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id,
                name: product.name || '',
                category: product.category || '',
                description: product.description || '',
                price: product.price || 0,
                images: product.images || [],
                tags: product.tags || [],
                inStock: product.inStock ?? true,
                featured: product.featured ?? false,
                noOfProducts: product.noOfProducts || 0,
                specifications: product.specifications || {},
                slug: product.slug || '',
                comparePrice: product.comparePrice || 0,
                preorderAvailable: product.preorderAvailable ?? false,
                rating: product.rating || 0,
                reviews: product.reviews || 0,
                variants: product.variants || {},
                visibility: product.visibility ?? true,
                sortOrder: product.sortOrder || 0,
                viewCount: product.viewCount || 0,
                salesCount: product.salesCount || 0,
                stockAlert: product.stockAlert || 0,
                dimensions: product.dimensions || {
                    length: 0,
                    width: 0,
                    height: 0,
                    weight: 0
                },
                seoKeywords: product.seoKeywords || [],
                relatedProducts: product.relatedProducts || [],
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',

            });
            setImageInput((product.images || []).join('\n'));
            setTagInput((product.tags || []).join(', '));
        }
    }, [product]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await productService.uploadProductImage(file);

        // 🛠 Ensure only string is pushed
        if (typeof url === 'string') {
            setFormData((prev) => ({
                ...prev,
                images: [url, ...(prev.images || [])]
            }));
        } else {
            console.error('Upload did not return a string URL:', url);
        }
    };




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

    const handleImagesChange = (value: string) => {
        setImageInput(value);
        setFormData(prev => ({
            ...prev,
            images: value.split('\n').filter(url => url.trim())
        }));
    };

    const handleTagsChange = (value: string) => {
        setTagInput(value);
        setFormData(prev => ({
            ...prev,
            tags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
        }));
    };

    const handleAddSpecification = () => {
        if (specKey && specValue) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...(prev.specifications || {}),
                    [specKey]: specValue,
                } as any, // ✅ fixes the type conflict
            }));

            setSpecKey('');
            setSpecValue('');
        }
    };

    const handleRemoveSpecification = (key: string) => {
        setFormData(prev => ({
            ...prev,
            specifications: Object.fromEntries(
                Object.entries(prev.specifications || {}).filter(([k]) => k !== key)
            ) as any
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add Product' : 'Edit Product'} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[75vh]"> {/* Add max height and scroll */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter Product Name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder='Enter price'
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            name="noOfProducts"
                            placeholder='Available stock quantity'
                            value={formData.noOfProducts}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500"
                    />
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        {(formData.images || []).map((img, index) => (
                            <div key={index} className="relative group border rounded overflow-hidden">
                                <img
                                    src={img}
                                    alt={`Product Image ${index + 1}`}
                                    className="w-full h-24 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: (prev.images || []).filter((_, i) => i !== index),
                                        }));
                                    }}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded opacity-80 hover:opacity-100"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="tag1, tag2, tag3"
                    />
                </div>

                <div className="flex space-x-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Featured</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                    </label>
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={specKey}
                                onChange={(e) => setSpecKey(e.target.value)}
                                placeholder="Key (e.g., material)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                value={specValue}
                                onChange={(e) => setSpecValue(e.target.value)}
                                placeholder="Value (e.g., gold)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleAddSpecification}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Add
                            </button>
                        </div>
                        {Object.entries(formData.specifications || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm"><strong>{key}:</strong> {value}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSpecification(key)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Compare Price</label>
                        <input
                            type="number"
                            name="comparePrice"
                            placeholder='Enter compare price'
                            value={formData.comparePrice}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock Alert</label>
                        <input
                            type="number"
                            name="stockAlert"
                            placeholder='Enter stock alert quantity'
                            value={formData.stockAlert}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                        <input
                            type="number"
                            name="sortOrder"
                            placeholder='Display order (e.g. 1, 2, 3)'
                            value={formData.sortOrder}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center">
                        <input type="checkbox" name="preorderAvailable" checked={formData.preorderAvailable} onChange={handleCheckboxChange} className="mr-2" />
                        Preorder Available
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" name="visibility" checked={formData.visibility} onChange={handleCheckboxChange} className="mr-2" />
                        Visible
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['length', 'width', 'height', 'weight'].map((field) => (
                            <div key={field}>
                                <input
                                    type="number"
                                    name={field}
                                    placeholder={field}
                                    value={(formData.dimensions as any)?.[field] || 0}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            dimensions: {
                                                ...prev.dimensions,
                                                [field]: parseFloat(e.target.value) || 0,
                                            },
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords (comma-separated)</label>
                    <input
                        type="text"
                        value={formData.seoKeywords?.join(', ') || ''}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean),
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                        <input
                            type="text"
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>





                <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Product' : 'Save Changes')}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

export default ProductDialog;
