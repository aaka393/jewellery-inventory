import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { TableData } from '../types';
import { useCartStore } from '../stores/cartStore';

interface ProductCardProps {
  product: TableData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price.toString().replace(/[^0-9.-]+/g, '')) : price;
    return `₹${numPrice.toFixed(2)}`;
  };

  const mainImage = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, quantity: 1 });
  };

  const getStockStatus = () => {
    if (product.inStock) {
      return { text: 'In Stock', color: 'text-green-600' };
    } else {
      return { text: 'Out of Stock', color: 'text-red-600' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </span>
            {product.category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                {product.category}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {product.rating && product.rating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating} ({product.reviews || 0})
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                product.inStock
                  ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;