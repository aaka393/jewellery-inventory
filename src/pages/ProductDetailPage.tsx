import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TableData } from '../types';
import { useCartStore } from '../stores/cartStore';
import TryOnFeature from '../components/TryOnFeature';

interface ProductDetailPageProps {
  products: TableData[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find(p => p.id === id);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return `₹${numPrice.toFixed(2)}`;
  };

  const isOutOfStock = (availability: string) => 
    availability.toLowerCase().includes('out') || availability.toLowerCase().includes('unavailable');

  const getAvailabilityColor = (availability: string) => {
    const status = availability.toLowerCase();
    if (status.includes('in stock') || status.includes('available')) {
      return 'text-green-600';
    } else if (status.includes('limited') || status.includes('low')) {
      return 'text-yellow-600';
    } else if (status.includes('out') || status.includes('unavailable')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  // Mock thumbnails - in a real app, these would come from the product data
  const images = [
    product.image,
    ...(product.thumbnails || [])
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (!isOutOfStock(product.availability)) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-purple-600'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.description} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.description}
                </h1>
                
                {/* Rating (Mock) */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.0) • 24 reviews</span>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`font-semibold ${getAvailabilityColor(product.availability)}`}>
                    {product.availability}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.fullDescription || `This exquisite ${product.description.toLowerCase()} is crafted with the finest materials and attention to detail. Perfect for special occasions or everyday elegance, this piece combines timeless design with modern sophistication.`}
                </p>
              </div>

              {/* Category */}
              {product.category && (
                <div>
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock(product.availability)}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    isOutOfStock(product.availability)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isOutOfStock(product.availability) ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {!isOutOfStock(product.availability) && (
                  <p className="text-sm text-gray-600 text-center">
                    Free shipping on orders over ₹500
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Try On Feature */}
          <div className="px-8 pb-8">
            <TryOnFeature 
              productImage={product.image} 
              productName={product.description} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;