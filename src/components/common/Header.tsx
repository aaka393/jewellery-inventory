import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Heart, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCategoryStore } from '../../store/categoryStore';
import SEOHead from '../seo/SEOHead';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { categories, loadCategories, setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories().catch(console.error);
  }, [loadCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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

  return (
    <>
      <SEOHead />
      
      {/* Shipping Banner */}
      <div className="bg-black text-white py-2 px-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs flex items-center space-x-8">
          <span>🚚 Shipping is free within India for orders above Rs. 500. International Shipping is Rs.3000</span>
          <span>🌟 We ship worldwide</span>
          <span>🚫 No COD</span>
          <span>🚚 Shipping is free within India for orders above Rs. 500. International Shipping is Rs.3000</span>
          <span>🌟 We ship worldwide</span>
          <span>🚫 No COD</span>
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Main header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JI</span>
              </div>
            </Link>

            {/* Search bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search icon for mobile */}
              <button className="md:hidden">
                <Search className="h-6 w-6 text-gray-600" />
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              
              {/* Help */}
              <button className="text-gray-600 hover:text-black">
                <HelpCircle className="h-5 w-5" />
              </button>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-black">
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user?.firstname} {user?.lastname}
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <User className="h-5 w-5 text-gray-600 cursor-pointer" onClick={() => navigate('/login')} />
              )}

              {/* Cart */}
              <button 
                onClick={() => setShowCartSidebar(true)}
                className="relative text-gray-600 hover:text-black"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Currency */}
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black"
                >
                  <span>INR(₹)</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      INR (₹)
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      USD ($)
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                HOME
              </Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  <span>NECKLACES</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => handleCategoryClick('necklaces')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All Necklaces
                  </button>
                  <button
                    onClick={() => handleCategoryClick('chokers')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Chokers
                  </button>
                  <button
                    onClick={() => handleCategoryClick('pendants')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Pendants
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  <span>EARRINGS</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => handleCategoryClick('earrings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All Earrings
                  </button>
                  <button
                    onClick={() => handleCategoryClick('jhumkas')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Jhumkas
                  </button>
                  <button
                    onClick={() => handleCategoryClick('studs')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Studs
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  <span>ACCESSORIES</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => handleCategoryClick('accessories')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    All Accessories
                  </button>
                  <button
                    onClick={() => handleCategoryClick('hair-accessories')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Hair Accessories
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleCategoryClick('bangles')}
                className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap"
              >
                BANGLES
              </button>
              
              <button
                onClick={() => handleCategoryClick('anklets')}
                className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap"
              >
                ANKLETS
              </button>
              
              <button
                onClick={() => handleCategoryClick('rings')}
                className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap"
              >
                RINGS
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                  <span>🌸 COLLECTIONS</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/products?tag=mostLoved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Most Loved
                  </Link>
                  <Link to="/products?tag=trendingNow" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Trending Now
                  </Link>
                  <Link to="/products?tag=newLaunch" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    New Launch
                  </Link>
                  <Link to="/products?tag=gifting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Gifting
                  </Link>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-pink-500 hover:text-pink-600 whitespace-nowrap">
                  <span>💖 BANGLE/KADA SIZES</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/size-guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Size Guide
                  </Link>
                  <Link to="/products?category=bangles&size=2.4" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Size 2.4
                  </Link>
                  <Link to="/products?category=bangles&size=2.6" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Size 2.6
                  </Link>
                  <Link to="/products?category=bangles&size=2.8" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Size 2.8
                  </Link>
                </div>
              </div>

              <Link to="/pre-orders" className="text-sm font-medium text-gray-700 hover:text-black whitespace-nowrap">
                PRE-ORDERS
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block py-2 text-sm font-medium text-gray-700">HOME</Link>
              <Link to="/category/necklaces" className="block py-2 text-sm font-medium text-gray-700">NECKLACES</Link>
              <Link to="/category/earrings" className="block py-2 text-sm font-medium text-gray-700">EARRINGS</Link>
              <Link to="/category/bangles" className="block py-2 text-sm font-medium text-gray-700">BANGLES</Link>
              <Link to="/category/anklets" className="block py-2 text-sm font-medium text-gray-700">ANKLETS</Link>
              <Link to="/category/rings" className="block py-2 text-sm font-medium text-gray-700">RINGS</Link>
              <Link to="/pre-orders" className="block py-2 text-sm font-medium text-gray-700">PRE-ORDERS</Link>
            </div>
          </div>
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">MY BAG ({currentItems.length})</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 200px)' }}>
          {currentItems.length === 0 ? (
            <div className="text-center mt-8">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your bag is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">{item.product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold">₹{item.product.price.toLocaleString()}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 border rounded flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 border rounded flex items-center justify-center text-sm"
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
              className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800"
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