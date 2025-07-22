import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useCartStore } from '../../store/cartStore';
import SEOHead from '../seo/SEOHead';
import { SITE_CONFIG } from '../../constants/siteConfig';
import Taanira from '../../assets/Taanira-logo.png';
import CartSidebar from './CartSidebar';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showText, setShowText] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { loadCategories } = useCategoryStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin'); // ✅ Admin page check

  const cartItemCount = getItemCount();

  useEffect(() => {
    loadCategories().catch(console.error);
  }, [loadCategories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    background: 'transparent',
    textColor: isHomePage ? '#FFFFFF' : '#5f3c2c',
    // ✅ Text color based on admin
    fontWeight: scrolled ? '500' : '700',
    borderColor: '#d4b896',
  };

  return (
    <>
      <SEOHead />
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isAdminPage ? 'border-b' : ''}`} // ✅ Only add border class for admin
        style={{
          backgroundColor: styles.background,
          borderColor: isAdminPage ? styles.borderColor : 'transparent',
          borderBottomWidth: isAdminPage ? '1px' : '0px',
        }}
      >
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="relative flex items-center justify-between">
            {/* Left - Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
              <button
                onClick={() => setIsMenuOpen(true)}
                style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                className={`hover:opacity-70 transition-opacity z-50 relative ${showText ? 'opacity-100 animate-fadeInSlow' : 'opacity-0'
                  }`}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {!isAdminPage && (
                <div className="hidden lg:flex space-x-6 xl:space-x-8 text-xs sm:text-sm tracking-widest transition-opacity duration-700">
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
                    ABOUT
                  </Link>
                </div>
              )}

            </div>

            {/* Center - Logo or Name */}
            <Link
              to="/"
              className={`absolute left-1/2 transform -translate-x-1/2 ${showText ? 'opacity-100 animate-fadeInSlow' : 'opacity-0'
                }`}
            >
              {isHomePage ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mt-1 sm:mt-2 lg:mt-4">
                  <img
                    src={Taanira}
                    alt="Logo"
                    className="w-full h-full object-contain transition-all duration-300"
                    style={{
                      filter: isAdminPage ? 'none' : 'brightness(0) invert(1)',
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span
                    className="text-lg sm:text-xl lg:text-2xl font-serif italic tracking-wide"
                    style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  >
                    {SITE_CONFIG.shortName}
                  </span>
                </div>
              )}
            </Link>

            {/* Right - Auth & Cart */}
            <div
              className={`flex items-center space-x-2 sm:space-x-3 lg:space-x-4 transition-opacity duration-700 ${
                showText ? 'opacity-100 animate-fadeInSlow' : 'opacity-0'
              }`}
            >
              {isAuthenticated ? (
                <div className="relative group hidden sm:block">
                  <button
                    className="flex items-center space-x-1 hover:opacity-70 transition-opacity"
                    style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  >
                    <span className="text-xs lg:text-sm tracking-widest">
                      {user?.firstname?.toUpperCase() || 'USER'}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
                    <Link to="/addresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Addresses
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
                  className="hidden sm:block text-xs lg:text-sm tracking-widest hover:opacity-70 transition-opacity cursor-pointer"
                  style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                >
                  LOGIN
                </Link>
              )}
{!isAdminPage && (
                <button
                  onClick={() => setShowCartSidebar(true)}
                  className="flex items-center gap-2 hover:opacity-70 transition-opacity relative"
                >
                  <span
                    className="hidden lg:inline text-xs tracking-widest"
                    style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
                  >
                    CART
                  </span>
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: styles.textColor }} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium text-[10px] sm:text-xs">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </div>
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 h-screen w-full sm:w-80 md:w-96 lg:w-1/3 xl:w-1/4 max-w-sm bg-[#1d1a15] z-50 shadow-lg px-4 sm:px-6 py-8 sm:py-10 flex flex-col justify-between text-[#d4b896] transition-all duration-500 ease-in-out overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-8 sm:mb-12">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-6 h-6 rounded-full border border-[#d4b896] flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <X className="h-4 w-4 text-[#d4b896]" />
                </button>
                <span className="tracking-widest text-xs sm:text-sm">CLOSE</span>
              </div>

              <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 text-center pl-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2">
                      PROFILE
                    </Link>
                    <div className="border-t border-[#d4b896]/20 mt-2" />
                    <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2">
                      SHOP
                    </Link>
                    <div className="border-t border-[#d4b896]/20 mt-2" />
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 flex items-center justify-center space-x-2 py-2">
                      <span>CART</span>
                      {cartItemCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-[#d4b896]/20 mt-2" />
                    <Link to="/addresses" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2">
                      ADDRESSES
                    </Link>
                    <div className="border-t border-[#d4b896]/20 mt-2" />
                    {user?.role === 'Admin' && (
                      <>
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2">
                          ADMIN PANEL
                        </Link>
                        <div className="border-t border-[#d4b896]/20 mt-2" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {['/', '/products', '/about'].map((path) => (
                      <div key={path}>
                        <Link
                          to={path}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2"
                        >
                          {path === '/' ? 'HOME' : path.replace('/', '').toUpperCase()}
                        </Link>
                        <div className="border-t border-[#d4b896]/20 mt-2" />
                      </div>
                    ))}
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 flex items-center justify-center space-x-2 py-2">
                      <span>CART</span>
                      {cartItemCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-[#d4b896]/20 mt-2" />
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2">
                      LOGIN
                    </Link>
                  </>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <div className="mt-6 sm:mt-8 text-center">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-base sm:text-lg tracking-[0.2em] font-light hover:opacity-80 py-2"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showCartSidebar && <CartSidebar onClose={() => setShowCartSidebar(false)} />}
    </>
  );
};

export default Header;

