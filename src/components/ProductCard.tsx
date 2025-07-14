import React from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCartStore } from '../stores/cartStore';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToWishlist,
  isWishlisted = false,
}) => {
  const { addToCart, getCartItem } = useCartStore();
  const cartItem = getCartItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={() => onViewDetails(product)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
            {onAddToWishlist && (
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full shadow-lg transition-colors duration-200 ${
                  isWishlisted 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {!product.inStock && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Out of Stock
            </span>
          )}
          {product.preorderAvailable && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              Pre-order
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock && !product.preorderAvailable}
            className="flex-1"
            leftIcon={<ShoppingCart className="h-4 w-4" />}
          >
            {cartItem 
              ? `In Cart (${cartItem.quantity})` 
              : product.preorderAvailable 
                ? 'Pre-order' 
                : 'Add to Cart'
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;