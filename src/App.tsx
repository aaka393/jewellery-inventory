import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import { CartProvider, useCart } from './context/CartContext';
import { TableData } from './types';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TryOnPage from './pages/TryOnPage';
import PaymentPage from './pages/PaymentPage';
import AdminPage from './pages/AdminPage';
import DataPage from './pages/DataPage';
import Cart from './components/Cart';
import LoadingSpinner from './components/ui/LoadingSpinner';
import BulkImport from './components/BulkImport';

// Mock data for development the app
const mockProducts = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    category: 'Diamond' as const,
    description: 'Elegant 1.5ct diamond solitaire ring in 18k white gold setting',
    price: 299999,
    images: [
      'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    preorderAvailable: false,
    inStock: true,
    specifications: {
      material: '18k White Gold',
      weight: '3.2g',
      dimensions: '6mm x 6mm',
      gemstone: '1.5ct Diamond'
    },
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Gold Pearl Necklace',
    category: 'Gold' as const,
    description: 'Luxurious freshwater pearl necklace with 22k gold chain',
    price: 89999,
    images: [
      'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    preorderAvailable: true,
    inStock: false,
    specifications: {
      material: '22k Gold',
      weight: '15.5g',
      dimensions: '18 inches',
      gemstone: 'Freshwater Pearls'
    },
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Silver Drop Earrings',
    category: 'Silver' as const,
    description: 'Contemporary silver drop earrings with cubic zirconia',
    price: 12999,
    images: [
      'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    preorderAvailable: false,
    inStock: true,
    specifications: {
      material: '925 Sterling Silver',
      weight: '4.2g',
      dimensions: '25mm x 8mm',
      gemstone: 'Cubic Zirconia'
    },
    rating: 4.4,
    reviews: 67
  },
  {
    id: '4',
    name: 'Platinum Wedding Band',
    category: 'Platinum' as const,
    description: 'Classic platinum wedding band with brushed finish',
    price: 45999,
    images: [
      'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    preorderAvailable: false,
    inStock: true,
    specifications: {
      material: '950 Platinum',
      weight: '6.8g',
      dimensions: '4mm width',
      gemstone: 'None'
    },
    rating: 4.9,
    reviews: 156
  }
];

// Mock API responses
const mockApiResponses = () => {
  // Override fetch for development
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // --- Your mocking logic ---
    if (urlString.includes('/api/products') && !urlString.includes('/api/products/')) {
      return new Response(JSON.stringify({
        success: true,
        data: {
          items: mockProducts,
          total: mockProducts.length,
          page: 1,
          limit: 20,
          totalPages: 1
        }
      }));
    }

    if (urlString.includes('/api/products/featured')) {
      return new Response(JSON.stringify({
        success: true,
        data: mockProducts.slice(0, 2)
      }));
    }

    if (urlString.includes('/api/products/') && urlString.includes('/recommendations')) {
      return new Response(JSON.stringify({
        success: true,
        data: mockProducts.slice(1, 3)
      }));
    }

    if (urlString.includes('/api/products/')) {
      const id = urlString.split('/').pop();
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        return new Response(JSON.stringify({
          success: true,
          data: product
        }));
      }
    }

    // Mock auth endpoints
    if (urlString.includes('/api/auth/login')) {
      return new Response(JSON.stringify({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            mobile: '9876543210',
            avatar: '',
            createdAt: new Date().toISOString()
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token'
        }
      }));
    }

    if (urlString.includes('/api/auth/register')) {
      return new Response(JSON.stringify({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            mobile: '9876543210',
            avatar: '',
            createdAt: new Date().toISOString()
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token'
        }
      }));
    }

    // Fall back to original fetch for other requests
    return originalFetch(input, init);
  };
};

function AppContent() {
  const { getCurrentUser, isLoading } = useAuthStore();
  const { getTotalItems } = useCart();
  const [data, setData] = useState<TableData[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleDataParsed = (parsedData: TableData[]) => {
    // Add unique IDs to the data
    const dataWithIds = parsedData.map((item, index) => ({
      ...item,
      id: `item-${Date.now()}-${index}`
    }));
    setData(dataWithIds);
  };

  useEffect(() => {
    // Initialize mock API responses in development
    if (import.meta.env.DEV) {
      mockApiResponses();
    }

    // Try to get current user if token exists
    getCurrentUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold text-purple-600">
                  Jewelry Store
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600">Admin</Link>
                  <Link to="/data" className="text-gray-700 hover:text-purple-600">Data</Link>
                  <Link to="/bulk-import" className="text-gray-700 hover:text-purple-600">Bulk Import</Link>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/try-on" element={<TryOnPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPage onDataParsed={handleDataParsed} />} />
          <Route path="/data" element={<DataPage data={data} />} />
          <Route path="/bulk-import" element={<BulkImport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Cart Sidebar */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;