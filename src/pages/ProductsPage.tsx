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

      const categoryToFilter = selectedCategory || category;
      if (categoryToFilter) {
        searchFilters.category = categoryToFilter;
      }

      const productsRes = await apiService.filterProducts(searchFilters);
      let filteredProducts = productsRes || [];

      if (query) {
        filteredProducts = filteredProducts.filter(product =>
          (product.name || '').toLowerCase().includes(query.toLowerCase()) ||
          (product.description || '').toLowerCase().includes(query.toLowerCase())
        );
      }

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
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-[#4A3F36]">
              {selectedCategory || searchParams.get('category')
                ? `${(selectedCategory || searchParams.get('category'))?.replace(/\b\w/g, l => l.toUpperCase())} Collection`
                : 'All Products'}
            </h1>
            <p className="text-[#6D6258] mt-1 text-sm">{products.length} products found</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#DEC9A3]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-[#4A3F36] rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition ${viewMode === 'grid' ? 'bg-[#DEC9A3] text-[#4A3F36]' : 'text-[#4A3F36] hover:bg-[#EFE8DB]'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition ${viewMode === 'list' ? 'bg-[#DEC9A3] text-[#4A3F36]' : 'text-[#4A3F36] hover:bg-[#EFE8DB]'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden bg-[#DEC9A3] text-[#4A3F36] px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-[#d1b990] transition"
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium tracking-wide">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6D6258] text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}
              >
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
