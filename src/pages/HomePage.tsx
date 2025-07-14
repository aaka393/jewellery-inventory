import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Sparkles, TrendingUp } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import Button from '../components/ui/Button';
import { ProductCategory } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    featuredProducts,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
    fetchProducts,
    fetchFeaturedProducts,
    searchProducts,
  } = useProductStore();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    fetchFeaturedProducts();
    if (!searchQuery) {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts();
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category: ProductCategory | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setLocalSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchProducts(query);
    } else {
      fetchProducts();
    }
  };

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const displayProducts = searchQuery ? products : (selectedCategory ? products : featuredProducts);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Gem className="h-16 w-16 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Exquisite Jewelry
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Discover our stunning collection of handcrafted jewelry
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                value={localSearchQuery}
                onChange={setLocalSearchQuery}
                onSearch={handleSearch}
                placeholder="Search for rings, necklaces, earrings..."
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/try-on')}
                leftIcon={<Sparkles className="h-5 w-5" />}
              >
                Try Virtual Jewelry
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                leftIcon={<TrendingUp className="h-5 w-5" />}
              >
                View Trending
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCategory 
                ? `${selectedCategory} Jewelry` 
                : 'Featured Products'
            }
          </h2>
          <p className="text-gray-600">
            {displayProducts.length} {displayProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={displayProducts}
          isLoading={isLoading}
          onProductClick={handleProductClick}
        />

        {/* Load More Button */}
        {!isLoading && displayProducts.length > 0 && !searchQuery && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => fetchProducts()}
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;