import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart, ShoppingCart, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCategoryStore } from '../../store/categoryStore';
import { apiService } from '../../services/api';
import SEOHead from '../seo/SEOHead';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
import { searchService } from '../../services/searchService';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Category } from '../../types';
import Tanvera from '../../assets/TanveeraP.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { categories, loadCategories, setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();
  const { trackSearch } = useAnalytics();

  useEffect(() => {
    loadCategories().catch(console.error);
    loadDynamicCategories();
  }, [loadCategories]);

  const loadDynamicCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setDynamicCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading dynamic categories:', error);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await searchService.getSearchSuggestions(searchQuery);
          setSearchSuggestions(response.result || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery, 0); // Will be updated with actual result count
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCategoryClick = (categoryName: string) => {
    try {
      setSelectedCategory(categoryName);
      navigate(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`);
    } catch (error) {
      console.error('Error navigating to category:', error);
    }
  };

  const safeCategories = categories || [];
  const cartCount = getItemCount() || 0;
  const wishlistCount = wishlistItems?.length || 0;

  // Hide navigation and search for admin users
  const isAdmin = user?.role === 'Admin';
  const isHomePage = window.location.pathname === '/';

  return (
    <>
      <SEOHead />
      
      {/* Shipping Banner - Only show on non-home pages */}
      {!isHomePage && (
      <div className="bg-black text-white py-2 px-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs flex items-center space-x-8">
          <span>🚚 Shipping is free within India for orders above {SITE_CONFIG.currencySymbol}{SITE_CONFIG.freeShippingThreshold}. International Shipping is {SITE_CONFIG.currencySymbol}{SITE_CONFIG.internationalShippingCost}</span>
          <span>🌟 We ship worldwide</span>
          <span>{SITE_CONFIG.features.codEnabled ? '💰 COD Available' : '🚫 No COD'}</span>
          <span>🚚 Shipping is free within India for orders above {SITE_CONFIG.currencySymbol}{SITE_CONFIG.freeShippingThreshold}. International Shipping is {SITE_CONFIG.currencySymbol}{SITE_CONFIG.internationalShippingCost}</span>
          <span>🌟 We ship worldwide</span>
          <span>{SITE_CONFIG.features.codEnabled ? '💰 COD Available' : '🚫 No COD'}</span>
        </div>
      </div>
      )}

      <header className={`${isHomePage ? 'fixed top-0 left-0 right-0 z-50 bg-transparent' : 'bg-white shadow-sm sticky top-0 z-50'}`}>
        {/* Main header */}
        <div className={`${isHomePage ? 'px-6 py-6' : 'container mx-auto px-4 py-4'}`}>
          <div className="flex items-center justify-between">
            {/* Left side - Hamburger Menu and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${isHomePage ? 'text-[#F2E9D8] hover:text-[#D4B896]' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              {/* Navigation Links - Hidden on mobile, shown on desktop for home page */}
              {isHomePage && (
                <div className="hidden md:flex space-x-8 text-sm tracking-widest">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
                  >
                    MENU
                  </button>
                  <Link 
                    to="/products" 
                    className="text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
                  >
                    SHOP
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
                  >
                    ABOUT
                  </Link>
                </div>
              )}
              
              {/* Logo for non-home pages */}
              {!isHomePage && (
                <Link to="/" className="flex items-center">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{SITE_CONFIG.shortName}</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Center Logo for home page */}
            {isHomePage && (
              <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 mt-4">
                    <img src={Tanvera} alt="img"  className="filter brightness-0 invert" />
                </div>
              </Link>
            )}

            {/* Right side - Login and Cart */}
            <div className="flex items-center space-x-8">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className={`flex items-center space-x-1 ${isHomePage ? 'text-[#F2E9D8] hover:text-[#D4B896]' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}>
                    <span className="text-sm tracking-widest">
                      {user?.firstname?.toUpperCase() || 'USER'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.firstname} {user?.lastname}
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/user/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Wishlist ({wishlistCount})
                    </Link>
                    {user?.role === 'Admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`text-sm tracking-widest ${isHomePage ? 'text-[#F2E9D8] hover:text-[#D4B896]' : 'text-gray-600 hover:text-black'} transition-colors duration-300 cursor-pointer`}
                >
                  LOGIN
                </Link>
              )}

              {/* Cart */}
              <button 
                onClick={() => setShowCartSidebar(true)}
                className={`relative ${isHomePage ? 'text-[#F2E9D8] hover:text-[#D4B896]' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
              >
                <span className="text-sm tracking-widest">CART</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4B896] text-[#1C1A17] text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Desktop Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-[#1C1A17] bg-opacity-95 z-40 flex items-center justify-center">
            <div className="text-center space-y-8">
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
              >
                SHOP
              </Link>
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
              >
                HOME
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
              >
                WINE
              </button>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
              >
                ABOUT
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
              >
                COLLECTIONS
              </Link>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-[#F2E9D8] hover:text-[#D4B896] transition-colors duration-300"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        )}

        {/* Search bar - Only for non-home pages and non-admin users */}
        {!isHomePage && !isAdmin && (
          <div className="container mx-auto px-4 py-2 border-t border-gray-200">
            <div className="flex justify-center">
              <div className="flex flex-1 max-w-md relative">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for jewelry..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <button type="submit" className="absolute right-3 top-2.5">
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </form>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion.query);
                          handleSearch(new Event('submit') as any);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{suggestion.query}</span>
                        <span className="text-xs text-gray-500">{suggestion.count} results</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Only for non-home pages and non-admin users */}
        {!isHomePage && !isAdmin && (
          <nav className="border-t border-gray-200">
            <div className="container mx-auto px-4">
              <div className="hidden md:flex items-center justify-center space-x-8 py-4">
                <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  JEWELRY
                </Link>
                <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  HOME
                </Link>
                
                <Link to="/pre-orders" className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  PRE-ORDERS
                </Link>

                {/* Dynamic Categories */}
                {dynamicCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap uppercase"
                  >
                    {category.name}
                  </button>
                ))}

                {/* Collections with dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                    <span>🌸 COLLECTIONS</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link to="/products?tag=mostLoved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Most Loved
                    </Link>
                    <Link to="/products?tag=trendingNow" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Trending Now
                    </Link>
                    <Link to="/products?tag=newLaunch" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      New Launch
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Cart Sidebar */}
      {showCartSidebar && (
        <CartSidebar onClose={() => setShowCartSidebar(false)} />
      )}
    </>
  );
};

// Cart Sidebar Component
const CartSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { items, guestItems, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const currentItems = isAuthenticated ? items : guestItems;

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:pr-0">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">MY BAG ({currentItems.length})</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 180px)' }}>
          {currentItems.length === 0 ? (
            <div className="text-center mt-8">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your bag is empty</p>
              <Link 
                to="/products" 
                onClick={onClose}
                className="inline-block mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  <img
                    src={item.product.images[0]?.startsWith('http') 
                      ? item.product.images[0] 
                      : `${staticImageBaseUrl}/${item.product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                    alt={item.product.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xs md:text-sm font-medium line-clamp-2">{item.product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs md:text-sm font-semibold">₹{item.product.price.toLocaleString()}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity - 1)}
                          className="w-5 h-5 md:w-6 md:h-6 border rounded flex items-center justify-center text-xs md:text-sm"
                        >
                          -
                        </button>
                        <span className="text-xs md:text-sm w-6 md:w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity + 1)}
                          className="w-5 h-5 md:w-6 md:h-6 border rounded flex items-center justify-center text-xs md:text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-gray-400 hover:text-red-500 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {currentItems.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">SUBTOTAL:</span>
              <span className="font-semibold">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Taxes and shipping fee will be calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-center text-sm text-gray-600 hover:text-black"
            >
              VIEW CART
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;