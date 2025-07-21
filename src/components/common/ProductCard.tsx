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
  const { trackAddToCart, trackAddToWishlist } = useAnalytics();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock) {
      addItem(product, 1);
      trackAddToCart(product.id);
      const button = e.currentTarget as HTMLButtonElement;
      const originalText = button.textContent;
      button.textContent = 'ADDED!';
      button.style.backgroundColor = '#10b981';
      setTimeout(() => {
        button.textContent = originalText!;
        button.style.backgroundColor = '';
      }, 1200);
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
    if (product.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const productImages = product.images?.length
    ? product.images.map((img) => (img.startsWith('http') ? img : staticImageBaseUrl + img))
    : ['https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'];

  return (
    <article className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden transform hover:scale-105">
      <Link to={`/product/${product.slug || product.id}`}>
        <div
          className="relative overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-300 ${
                isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>
          
          {/* Image navigation for multiple images */}
          {productImages.length > 1 && isHovered && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={prevImage}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Stock status */}
          {!product.stock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </div>
          )}
          
          {/* Quick view button */}
          {showQuickView && (
            <button
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 rounded-full hover:bg-black"
            >
              <Eye className="inline w-3 h-3 mr-1" />
              Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        {/* Brand */}
        <p className="text-xs text-gray-400 uppercase mb-1 tracking-wider">JI</p>
        
        {/* Product name */}
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-sm sm:text-base font-medium text-gray-800 hover:text-gray-600 line-clamp-2 mb-3 transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Price section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {SITE_CONFIG.currencySymbol} {(product.price || 0).toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {SITE_CONFIG.currencySymbol} {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Color options */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-300 hover:border-gray-500 cursor-pointer transition-colors duration-200" title="Silver" />
          <div className="w-4 h-4 bg-yellow-600 rounded-full border-2 border-gray-300 hover:border-gray-500 cursor-pointer transition-colors duration-200" title="Gold" />
          <div className="w-4 h-4 bg-rose-400 rounded-full border-2 border-gray-300 hover:border-gray-500 cursor-pointer transition-colors duration-200" title="Rose Gold" />
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="w-full py-2.5 text-sm font-medium border-2 border-gray-800 text-gray-800 rounded-md hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {product.stock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>

        {/* Delivery info */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Check delivery date</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;