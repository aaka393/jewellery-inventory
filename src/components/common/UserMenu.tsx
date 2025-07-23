import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import LogoutButton from './LogoutButton';

interface UserMenuProps {
  dropdownPosition?: 'top' | 'bottom';
}

const UserMenu: React.FC<UserMenuProps> = ({ dropdownPosition = 'bottom' }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'Admin';

  const styles = {
    textColor: isHomePage ? '#FFFFFF' : '#5f3c2c',
    fontWeight: '700',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center text-xs sm:text-sm lg:text-sm tracking-widest hover:opacity-70 transition-opacity h-8 sm:h-10 lg:h-12 min-w-0"
        style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
        title="Login to your account"
      >
        <span className="hidden sm:inline">LOGIN</span>
        <UserCircle className="h-4 w-4 sm:hidden" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center space-x-1 sm:space-x-2 hover:opacity-70 transition-all duration-200 h-8 sm:h-10 lg:h-12 outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 border-none min-w-0"
        style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
        title={`${user?.firstname || 'User'} Menu`}
      >
        {isAdmin && <UserCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
        <span className="text-xs sm:text-sm lg:text-sm tracking-widest truncate max-w-[80px] sm:max-w-none">
          {user?.firstname?.toUpperCase() || 'USER'}
        </span>
        <ChevronDown 
          className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>


      {isOpen && (
        <div
          className={`absolute ${
            dropdownPosition === 'top' ? 'bottom-full mb-2' : 'mt-2'
          } right-0 w-44 sm:w-48 lg:w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 min-w-max`}
        >
          <div className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-gray-700 border-b border-gray-100">
            <div className="font-medium truncate">{user?.firstname} {user?.lastname}</div>
            <div className="text-xs text-gray-500 truncate mt-1">{user?.email}</div>
          </div>
          <Link 
            to="/profile" 
            className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            title="View Profile"
          >
            Profile
          </Link>
          <Link 
            to="/user/orders" 
            className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            title="View Orders"
          >
            Orders
          </Link>
          <Link 
            to="/addresses" 
            className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            title="Manage Addresses"
          >
            Addresses
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="block px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              title="Admin Panel"
            >
              Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-100 my-1 mx-2"></div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
