import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategoryStore } from '../store/categoryStore';
import { Filter, Grid, List } from 'lucide-react';
import { Product, ProductFilters } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/filters/FilterSidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchParams] = useSearchParams();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  useEffect(() => {
    // Reset category selection when coming to products page without category
    if (!searchParams.get('category')) {
      setSelectedCategory(null);
    }
    loadProducts();
  }, [filters, searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const category = searchParams.get('category');
      const query = searchParams.get('q');
      
      let searchFilters = { ...filters };
      
      // Use selectedCategory from store or URL parameter
      const categoryToFilter = selectedCategory || category;
      if (categoryToFilter) {
        searchFilters.category = categoryToFilter;
      }
      
      const productsRes = await apiService.filterProducts(searchFilters);
      
      let filteredProducts = productsRes || [];
      
      // Apply text search if query exists
      if (query) {
        filteredProducts = filteredProducts.filter(product => 
          (product.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (product.description || '').toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Apply sorting
      filteredProducts = sortProducts(filteredProducts, sortBy);
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products: Product[], sortBy: string) => {
    if (!products || !Array.isArray(products)) return [];
    
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedCategory || searchParams.get('category') 
                ? `${(selectedCategory || searchParams.get('category'))?.replace(/\b\w/g, l => l.toUpperCase())} Collection` 
                : 'All Products'}
            </h1>
            <p className="text-gray-600 mt-1">{products.length} products found</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
            
            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            {/* Filter button (mobile) */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;