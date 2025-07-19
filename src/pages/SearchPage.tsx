import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Product } from '../types';
import { apiService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { searchService } from '../services/searchService';
import { useAnalytics } from '../hooks/useAnalytics';

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { trackSearch } = useAnalytics();

  useEffect(() => {
    if (query) {
      searchProducts();
    } else {
      setProducts([]);
      setTotalResults(0);
    }
  }, [query]);

  const searchProducts = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      
      const response = await apiService.searchProducts(query.trim());
      const searchResults = response.result;
      
      setProducts(searchResults.products || []);
      setTotalResults(searchResults.total || 0);
      
      // Track search analytics
      trackSearch(query, searchResults.total || 0);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrySearch = () => {
    if (query) {
      searchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `${totalResults} products found`}
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search terms or browse our categories
            </p>
            <div className="space-x-4">
              <button
                onClick={handleRetrySearch}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retry Search
              </button>
              <Link
                to="/products"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;