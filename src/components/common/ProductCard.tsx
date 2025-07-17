import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickView = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <article className="group relative bg-white">
      <Link to={`/product/${product.slug || product.id}`}>
        <div 
          className="relative overflow-hidden bg-gray-100 aspect-square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={`${product.name} - Handcrafted Silver Jewelry by JI`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>

          {/* Navigation arrows */}
          {productImages.length > 1 && isHovered && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={prevImage}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextImage}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stock badge */}
          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Featured
            </div>
          )}

          {/* Quick view button */}
          {showQuickView && (
            <button
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 inline mr-1" />
              Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">JI</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 hover:text-gray-600 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-lg font-medium text-gray-900">
            Rs. {(product.price || 0).toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              Rs. {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center justify-center space-x-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
          </div>
        )}

        {/* Color variants */}
        <div className="flex justify-center space-x-2 mb-3">
          <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-300" title="Silver"></div>
          <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-gray-300" title="Gold Plated"></div>
          <div className="w-4 h-4 bg-rose-400 rounded-full border-2 border-gray-300" title="Rose Gold"></div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2 px-4 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>

        {/* Stock quantity indicator */}
        {product.inStock && product.noOfProducts && product.noOfProducts <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.noOfProducts} left in stock!
          </p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;