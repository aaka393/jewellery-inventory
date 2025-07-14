import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  wishlistedProducts?: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onProductClick,
  onAddToWishlist,
  wishlistedProducts = [],
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-2xl">💎</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isWishlisted={wishlistedProducts.includes(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;