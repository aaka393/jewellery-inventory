import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategoryStore } from '../store/categoryStore';
import { Grid, List } from 'lucide-react';
import { Product} from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const loadProducts = async () => {
  try {
    setLoading(true);

    const category = searchParams.get('category');

    const fetchedProducts = await apiService.getProducts(); // now returns Product[]

    const categoryToFilter = selectedCategory || category;
    let filteredProducts = fetchedProducts;

    if (categoryToFilter) {
      filteredProducts = fetchedProducts.filter(
        (p) => p.category?.toLowerCase() === categoryToFilter.toLowerCase()
      );
    }

    const sortedProducts = sortProducts(filteredProducts, sortBy);
    setProducts(sortedProducts);
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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-16 sm:py-20">
        {/* Header with Animation */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-semibold text-[#4A3F36]">
              {selectedCategory || searchParams.get('category')
                ? `${(selectedCategory || searchParams.get('category'))?.replace(/\b\w/g, l => l.toUpperCase())} Collection`
                : 'All Products'}
            </h1>
            <p className="text-[#6D6258] mt-1 text-xs sm:text-sm">{products.length} products found</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-[#4A3F36] text-[#4A3F36] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-[#DEC9A3] text-xs sm:text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-[#4A3F36] rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2 sm:px-3 py-2 transition ${viewMode === 'grid' ? 'bg-[#DEC9A3] text-[#4A3F36]' : 'text-[#4A3F36] hover:bg-[#EFE8DB]'}`}
              >
                <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 sm:px-3 py-2 transition ${viewMode === 'list' ? 'bg-[#DEC9A3] text-[#4A3F36]' : 'text-[#4A3F36] hover:bg-[#EFE8DB]'}`}
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>


          </div>
        </div>

        <div className="flex gap-8">
          {/* Products Grid with Staggered Animation */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className={`text-center py-12 transform transition-all duration-1000 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <p className="text-[#6D6258] text-base sm:text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`transform transition-all duration-700 hover:scale-105 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: `${Math.min(index * 100, 1000)}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
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