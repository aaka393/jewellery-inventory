import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Minus, Plus, Facebook, Twitter, ZoomIn as Zoom, Maximize } from 'lucide-react';
import { Product, Review } from '../types';
import { apiService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { useAnalytics } from '../hooks/useAnalytics';
import { SITE_CONFIG } from '../constants/siteConfig';
import ProductReviews from '../components/reviews/ProductReviews';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<{
    metal?: string;
    size?: string;
    stone?: string;
  }>({});

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { trackProductView, trackAddToCart, trackAddToWishlist } = useAnalytics();

  useEffect(() => {
    if (slug) {
      loadProduct();
      loadReviews();
    }
  }, [slug]);

  useEffect(() => {
    if (product) {
      trackProductView(product.id);
    }
  }, [product, trackProductView]);

  const loadProduct = async () => {
    try {
      const productData = await apiService.getProductBySlug(slug!);
      setProduct(productData);
      
      // Set default variants
      if (productData?.variants) {
        setSelectedVariant({
          metal: productData.variants.metal,
          size: productData.variants.size,
          stone: productData.variants.stone
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsData = await apiService.getProductReviews(slug!);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      trackAddToCart(product.id);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
        trackAddToWishlist(product.id);
      }
    }
  };

  const nextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'pinterest') => {
    const url = window.location.href;
    const title = product?.name || 'Check out this jewelry piece';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <>
        <SEOHead
          title="Product Not Found - JI Jewelry"
          description="The product you're looking for doesn't exist."
        />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link
              to="/products"
              className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <>
      <SEOHead
        title={`${product.name} - JI Jewelry`}
        description={product.description || `Buy ${product.name} - Handcrafted pure silver jewelry from JI. Free shipping within India.`}
        keywords={`${product.name}, ${product.category}, silver jewelry, ${(product.tags || []).join(', ')}, JI jewelry`}
        image={productImages[0]}
        type="product"
        productData={{
          name: product.name,
          price: product.price,
          currency: 'INR',
          availability: product.inStock ? 'InStock' : 'OutOfStock',
          brand: 'JI',
          category: product.category
        }}
      />
      
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-black">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Thumbnail images - Left side */}
              <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 lg:absolute lg:left-0 lg:top-0 lg:w-20">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="relative bg-gray-100 lg:ml-24">
                <div className="aspect-square">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Stock badge */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.inStock 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </div>

                {/* Navigation buttons */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Zoom and fullscreen buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg flex items-center space-x-1">
                    <Zoom className="h-4 w-4" />
                    <span className="text-sm">Zoom</span>
                  </button>
                  <button className="bg-white rounded-full p-2 shadow-md hover:shadow-lg">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-light text-gray-800 mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-2xl font-medium text-gray-900">
                    {SITE_CONFIG.currencySymbol} {product.price.toLocaleString()}
                  </div>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="text-lg text-gray-500 line-through">
                      {SITE_CONFIG.currencySymbol} {product.comparePrice.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {product.inStock && product.noOfProducts && product.noOfProducts <= 5 && (
                  <p className="text-sm text-orange-600 mb-6">
                    Hurry! Only {product.noOfProducts} Left in Stock!
                  </p>
                )}
              </div>

              {/* Rating */}
              {product.rating && product.rating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
                </div>
              )}

              {/* Variants */}
              {(product.variants?.metal || product.variants?.size || product.variants?.stone) && (
                <div className="space-y-4">
                  {product.variants.metal && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
                      <select
                        value={selectedVariant.metal || ''}
                        onChange={(e) => setSelectedVariant(prev => ({ ...prev, metal: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value={product.variants.metal}>{product.variants.metal}</option>
                      </select>
                    </div>
                  )}
                  
                  {product.variants.size && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select
                        value={selectedVariant.size || ''}
                        onChange={(e) => setSelectedVariant(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value={product.variants.size}>{product.variants.size}</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-xs font-medium text-gray-800">PURE SILVER</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Truck className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-xs font-medium text-gray-800">FREE SHIPPING WITHIN</div>
                  <div className="text-xs font-medium text-gray-800">INDIA</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="text-xs font-medium text-gray-800">NO RETURNS/EXCHANGES</div>
                  <div className="text-xs font-medium text-gray-800">ONCE SOLD</div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'text-red-500 fill-current' : ''}`} />
                  <span>{isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Share */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">SHARE:</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleShare('pinterest')}
                    className="w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded"
                    aria-label="Share on Pinterest"
                  >
                    <span className="text-xs font-bold">P</span>
                  </button>
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="w-8 h-8 bg-blue-400 text-white flex items-center justify-center rounded"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping within India.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout via Razorpay.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Handcrafted Pure Silver Jewellery.</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-800">PRODUCT DESCRIPTION:</h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p>{product.description || 'Material: 92.5 pure silver'}</p>
                  
                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Specifications:</h4>
                      <ul className="space-y-1">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <li key={key}>
                            <strong className="capitalize">{key}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/products?tag=${encodeURIComponent(tag)}`}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          {reviews.length > 0 && (
            <div className="mt-16 pt-16 border-t border-gray-200">
              <h2 className="text-2xl font-light text-gray-800 mb-8">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
    </>
  );
};

export default ProductDetailPage;