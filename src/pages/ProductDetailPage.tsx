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

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price.toString()) : price;
    return `₹${numPrice.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      addItem(product);
    }
  };

  // Use product images or fallback
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/500x500?text=No+Image'];

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
                  src={images[selectedImageIndex]}
                  alt={product.name}
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
                        alt={`${product.name} ${index + 1}`}
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
                  {product.name}
                </h1>
                
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                
                {/* Rating */}
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating}) • {product.reviews || 0} reviews
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-purple-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className={`font-semibold ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.specifications.material && (
                      <div>
                        <span className="font-medium text-gray-700">Material:</span>
                        <span className="ml-2 text-gray-600">{product.specifications.material}</span>
                      </div>
                    )}
                    {product.specifications.weight && (
                      <div>
                        <span className="font-medium text-gray-700">Weight:</span>
                        <span className="ml-2 text-gray-600">{product.specifications.weight}</span>
                      </div>
                    )}
                    {product.specifications.dimensions && (
                      <div>
                        <span className="font-medium text-gray-700">Dimensions:</span>
                        <span className="ml-2 text-gray-600">{product.specifications.dimensions}</span>
                      </div>
                    )}
                    {product.specifications.gemstone && (
                      <div>
                        <span className="font-medium text-gray-700">Gemstone:</span>
                        <span className="ml-2 text-gray-600">{product.specifications.gemstone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category */}
              {product.category && (
                <div>
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    product.inStock
                      ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {product.inStock && (
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
              productImage={images[0]} 
              productName={product.name} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;