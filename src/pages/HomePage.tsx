import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { TableData, Category } from '../types';

interface HomePageProps {
  products: TableData[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  // Add categories to products if not present
  const productsWithCategories = useMemo(() => {
    return products.map(product => ({
      ...product,
      category: product.category || getProductCategory(product.description)
    }));
  }, [products]);

  // Simple category detection based on product description
  const getProductCategory = (description: string): Category => {
    const desc = description.toLowerCase();
    if (desc.includes('gold')) return 'Gold';
    if (desc.includes('silver')) return 'Silver';
    if (desc.includes('platinum')) return 'Platinum';
    if (desc.includes('diamond')) return 'Diamond';
    return 'Gold'; // Default category
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return productsWithCategories.filter(product => {
      const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [productsWithCategories, searchTerm, selectedCategory]);

  // Calculate product counts by category
  const productCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      'All': productsWithCategories.length,
      'Gold': 0,
      'Silver': 0,
      'Platinum': 0,
      'Diamond': 0
    };

    productsWithCategories.forEach(product => {
      if (product.category && product.category !== 'All') {
        counts[product.category as Category]++;
      }
    });

    return counts;
  }, [productsWithCategories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exquisite Jewelry Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our stunning collection of handcrafted jewelry pieces, 
            from elegant necklaces to brilliant diamond rings.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jewelry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          productCounts={productCounts}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {products.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
                  <p>Please check back later or contact us for more information.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                  <p>Try adjusting your search or category filter.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;