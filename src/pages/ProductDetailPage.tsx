import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw,
  Minus, Plus, Facebook, Twitter, ZoomIn as Zoom, Maximize
} from 'lucide-react';
import { Product } from '../types';
import { apiService } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { useAnalytics } from '../hooks/useAnalytics';
import { SITE_CONFIG, staticImageBaseUrl } from '../constants/siteConfig';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentTab, setTab] = useState<'About' | 'Ingredients' | 'Details'>('About');

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { trackProductView, trackAddToCart, trackAddToWishlist } = useAnalytics();

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product) trackProductView(product.id);
  }, [product, trackProductView]);

  const loadProduct = async () => {
    try {
      const productData = await apiService.getProductBySlug(slug!);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      trackAddToCart(product.id);
      alert(`Added ${quantity} ${product.name} to cart!`);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        alert('Removed from wishlist');
      } else {
        addToWishlist(product);
        trackAddToWishlist(product.id);
        alert('Added to wishlist');
      }
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
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

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <>
        <SEOHead title="Product Not Found - JI Jewelry" description="The product you're looking for doesn't exist." />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/products" className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => img.startsWith('http') ? img : `${staticImageBaseUrl}/${img}`)
    : ['https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'];

  return (
    <>
      <SEOHead
        title={`${product.name} - JI Jewelry`}
        description={product.description || `Buy ${product.name} - Handcrafted pure silver jewelry from JI.`}
        keywords={`${product.name}, ${product.category}, silver jewelry, JI jewelry`}
        image={productImages[0]}
        type="product"
        productData={{
          name: product.name,
          price: product.price,
          currency: 'INR',
          availability: product.stock ? 'InStock' : 'OutOfStock',
          brand: 'JI',
          category: product.category
        }}
      />

      <div className="min-h-screen bg-white">
        <div className="container mx-auto mt-[150px] px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-gray-100 lg:ml-24">
                <div className="aspect-square">
                  <img src={productImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`text-xs px-2 py-1 rounded ${product.stock ? 'bg-teal-500' : 'bg-red-500'} text-white`}>
                    {product.stock ? 'In stock' : 'Out of stock'}
                  </span>
                </div>
                {productImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg">
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>

              {/* Tabbed Product Info */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex space-x-6 border-b border-gray-200 mb-4">
                  {['About', 'Details'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTab(tab as any)}
                      className={`pb-2 font-medium uppercase tracking-wide text-sm ${
                        currentTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-700 leading-relaxed">
                  {currentTab === 'About' && (
                    <p>
                      Inspired by the delicate crepes found in Parisian cafés, our mix brings a touch of everyday elegance into your home. Whether filled with fresh fruit, a drizzle of fruit spread, or something savory, it’s a pantry staple we reach for again and again. Easy to prepare and endlessly adaptable, it’s made to turn ordinary mornings (and evenings!) into something special.
                    </p>
                  )}
                  {currentTab === 'Ingredients' && (
                    <ul className="list-disc ml-5">
                      <li>Wheat flour</li>
                      <li>Cane sugar</li>
                      <li>Sea salt</li>
                      <li>Natural vanilla flavor</li>
                    </ul>
                  )}
                  {currentTab === 'Details' && (
                    <p>
                      Net Weight: 16oz (1 lb) / 454g<br />
                      Shelf Life: 12 months from manufacturing date<br />
                      Storage: Keep in a cool, dry place<br />
                      Allergen info: Contains wheat
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
