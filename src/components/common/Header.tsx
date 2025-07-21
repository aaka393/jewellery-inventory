import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useCategoryStore } from '../../store/categoryStore';
import SEOHead from '../seo/SEOHead';
import { SITE_CONFIG, staticImageBaseUrl } from '../../constants/siteConfig';
import Taanira from '../../assets/Taanira-logo.png';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { loadCategories } = useCategoryStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    loadCategories().catch(console.error);
  }, [loadCategories]);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for background
      setScrolled(currentScrollY > 50);
      
      // Header visibility logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Header styles based on page type
  const getHeaderStyles = () => {
    if (isHomePage) {
      return {
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        textColor: scrolled ? '#5A5248' : '#FFFFFF',
        fontWeight: scrolled ? '500' : '700',
        backdropFilter: scrolled ? 'blur(10px)' : 'none'
      };
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        textColor: '#5A5248',
        fontWeight: '500',
        backdropFilter: 'blur(10px)'
      };
    }
  };

  const styles = getHeaderStyles();

  return (
    <>
      <SEOHead />
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ 
          backgroundColor: styles.background,
          backdropFilter: styles.backdropFilter
        }}
      >
        <div className='px-4 sm:px-6 py-4 sm:py-6'>
          <div className="flex items-center justify-between">
            {/* Left side - Navigation */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                className="hover:opacity-70 transition-opacity z-50 relative"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>

              <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm tracking-widest">
                <Link
                  to="/products"
                  style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  className="hover:opacity-70 transition-opacity"
                >
                  SHOP
                </Link>
                <Link
                  to="/about"
                  style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  className="hover:opacity-70 transition-opacity"
                >
                  {isHomePage ? 'WINE' : 'ABOUT'}
                </Link>
              </div>
            </div>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              {isHomePage ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 mt-2 sm:mt-4">
                  <img 
                    src={Taanira} 
                    alt="Logo" 
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      scrolled ? '' : 'filter brightness-0 invert'
                    }`}
                    style={{
                      filter: scrolled ? 'none' : 'brightness(0) invert(1)'
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span 
                    className="text-xl sm:text-2xl font-serif italic tracking-wide"
                    style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  >
                    {SITE_CONFIG.shortName}
                  </span>
                </div>
              )}
            </Link>

            {/* Right side - Login and Cart */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button 
                    className='flex items-center space-x-1 hover:opacity-70 transition-opacity'
                    style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  >
                    <span className="text-xs sm:text-sm tracking-widest">
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
                  className='text-xs sm:text-sm tracking-widest hover:opacity-70 transition-opacity cursor-pointer'
                  style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                >
                  LOGIN
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setShowCartSidebar(true)}
                className='relative flex items-center gap-2 hover:opacity-70 transition-opacity'
              >
                <span 
                  className="text-xs sm:text-sm tracking-widest"
                  style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                >
                  CART
                </span>
                <div 
                  className="w-4 h-4 sm:w-5 sm:h-5 border rounded-sm"
                  style={{ borderColor: styles.textColor }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Desktop Menu Overlay - Fixed vertical layout */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-40 flex items-center justify-center">
            <nav className="text-center space-y-8">
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-white hover:opacity-70 transition-opacity transform hover:scale-105 duration-300"
              >
                SHOP
              </Link>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-white hover:opacity-70 transition-opacity transform hover:scale-105 duration-300"
              >
                HOME
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl md:text-4xl font-light text-white hover:opacity-70 transition-opacity transform hover:scale-105 duration-300"
              >
                {isHomePage ? 'WINE' : 'ABOUT'}
              </Link>
            </nav>

            {/* Close button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white hover:opacity-70 transition-opacity"
            >
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
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

// Enhanced Cart Sidebar Component with simplified product display
const CartSidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { items, guestItems, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  console.log("items", items)
  console.log("guestItems", guestItems)
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const currentItems = isAuthenticated ? items : guestItems;

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-sm md:max-w-md lg:max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">MY BAG ({currentItems.length})</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
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
                <div key={item.id} className="flex items-start space-x-3 border-b pb-4">
                  <img
                    src={item.product.images[0]?.startsWith('http')
                      ? item.product.images[0]
                      : `${staticImageBaseUrl}/${item.product.images[0]}` || 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772'}
                    alt={item.product.name}
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {/* Product Name - Only display name */}
                    <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2 mb-2">
                      {item.product.name}
                    </h3>
                    
                    {/* Product Price - Only display price */}
                    <div className="text-sm md:text-base font-semibold text-gray-900 mb-3">
                      ₹{item.product.price.toLocaleString()}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          className="w-6 h-6 md:w-7 md:h-7 border rounded flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm md:text-base w-6 md:w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          className="w-6 h-6 md:w-7 md:h-7 border rounded flex items-center justify-center text-sm hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {currentItems.length > 0 && (
          <div className="border-t p-4 bg-white">
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
              className="w-full mt-2 text-center text-sm text-gray-600 hover:text-black transition-colors"
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