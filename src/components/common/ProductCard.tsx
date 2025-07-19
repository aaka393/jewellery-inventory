import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickView = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { trackAddToCart, trackAddToWishlist, trackProductView } = useAnalytics();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock) {
      addItem(product, 1);
      trackAddToCart(product.id);
      
      // Show success feedback
      const button = e.currentTarget as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = 'ADDED!';
      button.style.backgroundColor = '#10b981';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
      }, 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      trackAddToWishlist(product.id);
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
    ? product.images.map(img => img.startsWith('http') ? img : staticImageBaseUrl + img)
    : ['https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'];

  return (
    <article className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link to={`/product/${product.slug || product.id}`}>
        <div 
          className="relative overflow-hidden bg-gray-100 aspect-square rounded-t-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={`${product.name} - Handcrafted Silver Jewelry by JI`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          
          {/* White translucent overlay on hover */}
          <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 ease-out" />
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`h-3 w-3 md:h-4 md:w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>

          {/* Navigation arrows */}
          {productImages.length > 1 && isHovered && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={prevImage}
                className="p-1.5 md:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button 
                onClick={nextImage}
                className="p-1.5 md:p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          )}

          {/* Stock badge */}
          {!product.stock && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}

          {/* Quick view button */}
          {showQuickView && (
            <button
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"
              aria-label="Quick view"
            >
              <Eye className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
              Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="p-3 md:p-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">JI</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-xs md:text-sm font-medium text-gray-800 hover:text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="text-sm md:text-base font-medium text-gray-900">
            {SITE_CONFIG.currencySymbol} {(product.price || 0).toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs md:text-sm text-gray-500 line-through">
              {SITE_CONFIG.currencySymbol} {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Color variants */}
        <div className="flex justify-center space-x-1.5 md:space-x-2 mb-3">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-800 rounded-full border-2 border-gray-300" title="Silver"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-600 rounded-full border-2 border-gray-300" title="Gold Plated"></div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-rose-400 rounded-full border-2 border-gray-300" title="Rose Gold"></div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="w-full py-2 px-3 md:px-4 border border-gray-300 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-b-lg"
        >
          {product.stock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;