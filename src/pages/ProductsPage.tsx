import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategoryStore } from '../store/categoryStore';
import { Grid, List, ChevronDown } from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [categoryType, setCategoryType] = useState<string>(''); // Empty initially
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  useEffect(() => {
    if (!searchParams.get('category')) {
      setSelectedCategory(null);
    }
    loadProducts();
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [selectedParentCategoryId, selectedSubcategoryId, categoryType, allProducts]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await apiService.getProducts();
      const fetchedCategories = await apiService.getCategories();
      setAllProducts(fetchedProducts);
      setCategories(fetchedCategories);
      filterProductsWithData(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getParentCategories = (): Category[] => {
    return categories.filter(cat => !cat.parentId || cat.parentId === '');
  };

  const getFilteredParentCategories = (): Category[] => {
    let parentCats = getParentCategories();
    console.log('Initial parentCats:', parentCats);
    console.log('categoryType:', categoryType);
    console.log('allProducts:', allProducts);
    console.log('categories:', categories);

    if (categoryType !== '') {
      parentCats = parentCats.filter(cat => cat.categoryType?.toLowerCase() === categoryType.toLowerCase());
    }
    console.log('Filtered parentCats:', parentCats);
    return parentCats.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getSubcategories = (parentId: string): Category[] => {
    return categories.filter(cat => cat.parentId === parentId).sort((a, b) => a.name.localeCompare(b.name));
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const filterProductsWithData = (productsData: Product[]) => {
    const category = searchParams.get('category');
    const categoryToFilter = selectedCategory || category;

    let filteredProducts = productsData;

    if (selectedSubcategoryId) {
      const subcategory = getCategoryById(selectedSubcategoryId);
      filteredProducts = productsData.filter(
        (p) => p.category?.toLowerCase() === subcategory?.name.toLowerCase()
      );
    } else if (selectedParentCategoryId) {
      const parentCategory = getCategoryById(selectedParentCategoryId);
      filteredProducts = productsData.filter(
        (p) => p.category?.toLowerCase() === parentCategory?.name.toLowerCase()
      );
    } else if (categoryToFilter) {
      filteredProducts = productsData.filter(
        (p) => p.category?.toLowerCase() === categoryToFilter.toLowerCase()
      );
    }

    if (categoryType !== '') {
      filteredProducts = filteredProducts.filter(
        (p) => p.type?.toLowerCase() === categoryType.toLowerCase()
      );
    }

    const sortedProducts = sortProducts(filteredProducts, sortBy);
    setProducts(sortedProducts);
  };

  const filterProducts = () => {
    if (allProducts.length > 0) {
      filterProductsWithData(allProducts);
    }
  };

  const sortProducts = (products: Product[], sortBy: string) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return [...products].sort((a, b) => new Date(b.id || '').getTime() - new Date(a.id || '').getTime());
      default:
        return products;
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setProducts(sortProducts(products, newSortBy));
  };

  const handleParentCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedParentCategoryId('');
      setSelectedSubcategoryId('');
      setShowSubcategories(false);
      setSelectedCategory(null);
    } else {
      setSelectedParentCategoryId(categoryId);
      setSelectedSubcategoryId('');
      const category = getCategoryById(categoryId);
      setSelectedCategory(category?.name || null);
      const hasSubcategories = getSubcategories(categoryId).length > 0;
      setShowSubcategories(hasSubcategories);
    }
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    if (subcategoryId === 'all-sub') {
      setSelectedSubcategoryId('');
    } else {
      setSelectedSubcategoryId(subcategoryId);
    }
  };

  const getDisplayedCategoryName = () => {
    if (selectedSubcategoryId) return getCategoryById(selectedSubcategoryId)?.name || '';
    if (selectedParentCategoryId) return getCategoryById(selectedParentCategoryId)?.name || '';
    const urlCategory = searchParams.get('category');
    return urlCategory ? urlCategory.replace(/\b\w/g, l => l.toUpperCase()) : 'All Products';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-serif font-semibold text-[#4A3F36]">
              {getDisplayedCategoryName()}
              {(selectedParentCategoryId || selectedSubcategoryId || searchParams.get('category')) && ' Collection'}
            </h1>
            <p className="text-[#6D6258] mt-1 text-xs sm:text-sm">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={categoryType}
                onChange={(e) => {
                  setCategoryType(e.target.value);
                  setSelectedParentCategoryId('');
                  setSelectedSubcategoryId('');
                }}
                className="w-full sm:w-auto min-w-[140px] appearance-none px-3 py-2 pr-8 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-white focus:outline-none text-xs sm:text-sm"
              >
                <option value="">Category Type</option>
                <option value="Handlom">Handlom</option>
                <option value="Handmade">Handmade</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A3F36] pointer-events-none" />
            </div>

            {categoryType && (
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedParentCategoryId || 'all'}
                  onChange={(e) => handleParentCategoryChange(e.target.value)}
                  className="w-full sm:w-auto min-w-[140px] appearance-none px-3 py-2 pr-8 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-white focus:outline-none text-xs sm:text-sm"
                >
                  <option value="all">All Categories</option>
                  {getFilteredParentCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A3F36] pointer-events-none" />
              </div>
            )}

            {categoryType && showSubcategories && getSubcategories(selectedParentCategoryId).length > 0 && (
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedSubcategoryId || 'all-sub'}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full sm:w-auto min-w-[140px] appearance-none px-3 py-2 pr-8 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-white focus:outline-none text-xs sm:text-sm"
                >
                  <option value="all-sub">All {getCategoryById(selectedParentCategoryId)?.name}</option>
                  {getSubcategories(selectedParentCategoryId).map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A3F36] pointer-events-none" />
              </div>
            )}

            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full sm:w-auto min-w-[120px] appearance-none px-3 py-2 pr-8 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-white focus:outline-none text-xs sm:text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A3F36] pointer-events-none" />
            </div>

            <div className="flex border border-[#4A3F36] rounded-md overflow-hidden w-full sm:w-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#DEC9A3]' : ''}`}
              >
                <Grid className="h-4 w-4 text-[#4A3F36]" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#DEC9A3]' : ''}`}
              >
                <List className="h-4 w-4 text-[#4A3F36]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
