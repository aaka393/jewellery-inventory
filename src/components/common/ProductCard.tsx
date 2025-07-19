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
    <article className="group relative bg-white rounded-md shadow-sm hover:shadow-md transition duration-300 border border-gray-200">
      <Link to={`/product/${product.slug || product.id}`}>
        <div
          className="relative overflow-hidden bg-gray-100 h-40 rounded-t-md"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-1.5 right-1.5 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Wishlist"
          >
            <Heart
              className={`h-3 w-3 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
          {productImages.length > 1 && isHovered && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={prevImage}
                className="p-1 bg-white rounded-full shadow"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={nextImage}
                className="p-1 bg-white rounded-full shadow"
                aria-label="Next"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
          {!product.stock && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
              Out of Stock
            </div>
          )}
          {showQuickView && (
            <button
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition rounded"
            >
              <Eye className="inline w-3 h-3 mr-1" />
              Quick View
            </button>
          )}
        </div>
      </Link>

      <div className="p-2 text-center">
        <p className="text-[10px] text-gray-400 uppercase mb-0.5">JI</p>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-xs font-medium text-gray-700 hover:text-gray-600 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-center space-x-1 mt-1 mb-2">
          <span className="text-sm font-semibold text-gray-900">
            {SITE_CONFIG.currencySymbol} {(product.price || 0).toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-gray-500 line-through">
              {SITE_CONFIG.currencySymbol} {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="hidden md:flex justify-center space-x-1 mb-2">
          <div className="w-3 h-3 bg-gray-800 rounded-full border border-gray-300" title="Silver" />
          <div className="w-3 h-3 bg-yellow-600 rounded-full border border-gray-300" title="Gold" />
          <div className="w-3 h-3 bg-rose-400 rounded-full border border-gray-300" title="Rose Gold" />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="w-full py-1.5 text-[11px] border border-gray-300 font-medium text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
