import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import LogoutButton from './LogoutButton';

const UserMenu: React.FC = () => {
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
        className="hidden sm:flex items-center text-xs lg:text-sm tracking-widest hover:opacity-70 transition-opacity h-8 sm:h-10 lg:h-12"
        style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
      >
        LOGIN
      </Link>
    );
  }

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center space-x-1 hover:opacity-70 transition-opacity h-8 sm:h-10 lg:h-12 outline-none focus:outline-none focus:ring-0 active:outline-none active:ring-0 border-none"
        style={{ color: styles.textColor, fontWeight: styles.fontWeight }}
      >
        {isAdmin && <UserCircle className="h-4 w-4 mr-1" />}
        <span className="text-xs lg:text-sm tracking-widest">
          {user?.firstname?.toUpperCase() || 'USER'}
        </span>
        {isOpen ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>


      {isOpen && (
        <div
          className={`absolute ${isAdmin ? 'bottom-full mb-2' : 'mt-2'
            } right-0 w-44 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50`}
        >
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
          {isAdmin && (
            <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-100 my-1"></div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserMenu;
