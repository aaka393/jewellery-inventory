import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Product, Category } from '../types';
import { apiService } from '../services/api';
import { useCategoryStore } from '../store/categoryStore';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { searchService } from '../services/searchService';
import { SITE_CONFIG } from '../constants/siteConfig';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [mostLovedProducts, setMostLovedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mostLoved');
  
  const { setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, featuredRes] = await Promise.all([
        searchService.getFeaturedProducts(),
        apiService.getCategories(),
        searchService.getProductsByTag('mostLoved'),
      ]);
      
      const allProducts = productsRes?.result || [];
      const featuredProducts = featuredRes?.result || [];
      
      // Filter products by tags
      setFeaturedProducts(allProducts.slice(0, 8));
      setMostLovedProducts(featuredProducts.slice(0, 8));
      setTrendingProducts(allProducts.filter(p => (p.tags || []).includes('trendingNow')).slice(0, 8));
      setNewProducts(allProducts.filter(p => (p.tags || []).includes('newLaunch')).slice(0, 8));
      
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setFeaturedProducts([]);
      setMostLovedProducts([]);
      setTrendingProducts([]);
      setNewProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`);
  };

  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'mostLoved':
        return mostLovedProducts.length > 0 ? mostLovedProducts : featuredProducts;
      case 'trending':
        return trendingProducts.length > 0 ? trendingProducts : featuredProducts;
      case 'newProducts':
        return newProducts.length > 0 ? newProducts : featuredProducts;
      default:
        return featuredProducts;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEOHead
        title={`${SITE_CONFIG.name} - ${SITE_CONFIG.description} | Necklaces, Earrings, Bangles`}
        description={`Discover exquisite handcrafted pure silver jewelry at ${SITE_CONFIG.name}. Shop necklaces, earrings, bangles, anklets and more. Free shipping within India.`}
        keywords={`silver jewelry, handcrafted jewelry, necklaces, earrings, bangles, anklets, rings, Indian jewelry, ${SITE_CONFIG.name}, pure silver, 925 silver`}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Bangles */}
              <button 
                onClick={() => handleCategoryClick('bangles')}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-black">
                  <img
                    src="https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772"
                    alt="Silver Bangles - Handcrafted Pure Silver Jewelry"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
                  <h3 className="text-center font-medium text-gray-800">BANGLES</h3>
                </div>
              </button>

              {/* Jhumkas */}
              <button 
                onClick={() => handleCategoryClick('jhumkas')}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-black">
                  <img
                    src="https://www.macsjewelry.com/cdn/shop/files/IMG_4362_594x.progressive.jpg?v=1701478781"
                    alt="Silver Jhumkas - Traditional Indian Earrings"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
                  <h3 className="text-center font-medium text-gray-800">JHUMKAS</h3>
                </div>
              </button>

              {/* Anklets */}
              <button 
                onClick={() => handleCategoryClick('anklets')}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-black">
                  <img
                    src="https://www.macsjewelry.com/cdn/shop/files/IMG_4361_594x.progressive.jpg?v=1701478781"
                    alt="Silver Anklets - Elegant Foot Jewelry"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
                  <h3 className="text-center font-medium text-gray-800">ANKLETS</h3>
                </div>
              </button>

              {/* Necklaces */}
              <button 
                onClick={() => handleCategoryClick('necklaces')}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-black">
                  <img
                    src="https://www.macsjewelry.com/cdn/shop/files/5F29B418-6DDF-402D-920C-FD2EFA58A8FE_594x.progressive.jpg?v=1709126331"
                    alt="Silver Necklaces - Statement Jewelry Pieces"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
                  <h3 className="text-center font-medium text-gray-800">NECKLACES</h3>
                </div>
              </button>
            </div>

            {/* Trending Now Section */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-light text-gray-800 mb-8">TRENDING NOW</h2>
            </div>

            {/* Second Row Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'rings', image: '6624862' },
                { name: 'accessories', image: '1447333' },
                { name: 'bracelets', image: '1191537' },
                { name: 'pendants', image: '6624862' }
              ].map((item, index) => (
                <button 
                  key={item.name}
                  onClick={() => handleCategoryClick(item.name)}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <div className="aspect-square bg-black">
                    <img
                      src={`https://images.pexels.com/photos/${item.image}/pexels-photo-${item.image}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                      alt={`${item.name} - Silver Jewelry Collection`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Hero Banner Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Banner */}
              <div className="relative overflow-hidden rounded-lg bg-black">
                <img
                  src="https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772"
                  alt={`Silver Dholki Wax Necklaces by ${SITE_CONFIG.name}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-8 text-white">
                    <h3 className="text-2xl font-light mb-2">SILVER DHOLKI WAX NECKLACES</h3>
                    <p className="text-sm opacity-90">BY {SITE_CONFIG.shortName}</p>
                  </div>
                </div>
              </div>

              {/* Right Banner */}
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="https://www.macsjewelry.com/cdn/shop/files/IMG_4362_594x.progressive.jpg?v=1701478781"
                  alt="Traditional Silver Jewelry Collection"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-8 mb-12">
              <button 
                onClick={() => setActiveTab('mostLoved')}
                className={`text-lg font-medium pb-2 ${
                  activeTab === 'mostLoved' 
                    ? 'text-gray-800 border-b-2 border-gray-800' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Most Loved
              </button>
              <button 
                onClick={() => setActiveTab('trending')}
                className={`text-lg font-medium pb-2 ${
                  activeTab === 'trending' 
                    ? 'text-gray-800 border-b-2 border-gray-800' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Trending Now
              </button>
              <button 
                onClick={() => setActiveTab('newProducts')}
                className={`text-lg font-medium pb-2 ${
                  activeTab === 'newProducts' 
                    ? 'text-gray-800 border-b-2 border-gray-800' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                New Products
              </button>
            </div>

            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {getCurrentProducts().length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products available in this category at the moment.</p>
                <Link 
                  to="/products" 
                  className="inline-block mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            )}

            {getCurrentProducts().length > 0 && (
              <div className="text-center mt-12">
                <Link 
                  to="/products" 
                  className="inline-flex items-center space-x-2 bg-black text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
                >
                  <span>View All Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pure Silver</h3>
                <p className="text-gray-600">Handcrafted with 92.5% pure silver for lasting quality</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Free Shipping</h3>
                <p className="text-gray-600">Free shipping within India for orders above {SITE_CONFIG.currencySymbol} {SITE_CONFIG.freeShippingThreshold}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Worldwide Shipping</h3>
                <p className="text-gray-600">We ship our beautiful jewelry worldwide</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;