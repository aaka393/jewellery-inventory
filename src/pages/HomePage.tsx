import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import Footer from '../components/common/Footer';
import Neckless from '../assets/Neckless.jpg';
import catalog from '../assets/Devi.jpg';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('heroAnimated');
    if (!alreadyShown) {
      setHasAnimated(true);
      sessionStorage.setItem('heroAnimated', 'true');
    }
  }, []);

  const renderLetters = (text: string) =>
    text.split('').map((char, index) => (
      <motion.span key={index} variants={letter}>
        {char === ' ' ? ' ' : char}
      </motion.span>
    ));

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    const categoriesRes = await apiService.getCategories();
    const productsRes = await apiService.getProducts();

    console.log('Raw Products:', productsRes); // ✅ log raw

    const filtered = (productsRes || []).filter((p) => p.image);
    console.log('Filtered Products:', filtered); // ✅ log filtered

    setCategories(categoriesRes || []);
    setLatestProducts(filtered); // remove .slice(0, 4) for now
  } catch (error) {
    console.error('Error loading data:', error);
    setCategories([]);
    setLatestProducts([]);
  } finally {
    setLoading(false);
  }
};


  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEOHead
        title={`${SITE_CONFIG.name} - ${SITE_CONFIG.description} | Necklaces, Earrings, Bangles`}
        description={`Discover exquisite handcrafted pure silver jewelry at ${SITE_CONFIG.name}. Shop necklaces, earrings, bangles, anklets and more. Free shipping within India.`}
        keywords={`silver jewelry, handcrafted jewelry, necklaces, earrings, bangles, anklets, rings, Indian jewelry, ${SITE_CONFIG.name}, pure silver, 925 silver`}
      />

      <div className="text-[#F2E9D8] overflow-hidden">
        <Header />

        <section className="min-h-screen relative flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-screen">
            <div className="relative overflow-hidden min-h-[50vh] lg:min-h-screen">
              <img
                src="https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero Left"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1A17]/30"></div>
            </div>
            <div className="relative overflow-hidden hidden lg:block min-h-screen">
              <img src={Neckless} alt="Hero Right" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 lg:px-8 z-10 max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif italic text-[#F2E9D8] mb-4 sm:mb-6"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {renderLetters(SITE_CONFIG.shortName)}
              </motion.h1>

              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide text-[#D4B896] max-w-xs sm:max-w-md lg:max-w-lg mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: hasAnimated ? 1.5 : 0, duration: 1 }}
              >
                {SITE_CONFIG.description}
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#804000] italic">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-base md:text-lg font-light bold text-[#804000]">
              Discover our handcrafted pure silver jewelry collection.
            </p>
            <Link
              to="/products"
              className="inline-block mt-6 sm:mt-8 text-xs sm:text-sm text-[#804000] tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 font-serif italic">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#804000] mb-4 tracking-wide">
                Shop by Category
              </h2>
              <div className="w-24 h-[1px] bg-[#D4B896] mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-[#804000] font-light max-w-2xl mx-auto mb-6 px-4">
                Each piece is meticulously crafted with attention to detail, using only the finest materials
              </p>
              <div className="mt-8 sm:mt-10">
                <h3 className="text-xl sm:text-2xl text-[#804000] mb-2">Our Collections</h3>
                <p className="text-sm sm:text-base text-[#804000]">Discover our handcrafted collections of silver jewelry</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {latestProducts.map((product) => (
                <div key={product.id} className="flex flex-col items-center">
                  <div className="group relative w-full aspect-[3/4] border border-[#d4b896] sm:border-2 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl lg:hover:shadow-2xl transition-shadow duration-500 bg-white">
                    <img
                      src={product.hoverImage || product.image}
                      alt={`${product.name} - Hover`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
                    />
                    <div className="relative w-full h-full flex items-center justify-center z-10 p-2 sm:p-3 lg:p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain max-h-full"
                      />
                    </div>
                    {product.isSoldOut && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 bg-white text-[#1d1a15] text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded tracking-wide">
                        SOLD OUT
                      </span>
                    )}
                    {product.isNew && !product.isSoldOut && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30 bg-[#d4b896] text-[#1d1a15] text-xs font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full tracking-wide">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-center mt-3 sm:mt-4 space-y-1 sm:space-y-2 w-full px-1">
                    <h3 className="text-xs sm:text-sm lg:text-base text-[#aa732f] line-clamp-2">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-[#aa732f] font-semibold">₹{product.price}</p>
                    {!product.isSoldOut && (
                      <button
                        className="mt-1 sm:mt-2 px-3 sm:px-4 py-1 text-xs text-white bg-[#aa732f] hover:bg-[#8f5f23] rounded-full transition-colors duration-300 w-full sm:w-auto"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16 sm:mt-24 lg:mt-32">
              <Link
                to="/products"
                className="bg-[#D4B896] text-[#1C1A17] px-8 sm:px-12 py-3 sm:py-4 text-xs sm:text-sm tracking-widest hover:bg-[#F2E9D8] transition-colors inline-block"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen flex items-center">
          <div className="absolute inset-0">
            <img src={catalog} alt="Brand" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#1C1A17]/40"></div>
          </div>
          <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-left space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#F2E9D8]">
              {SITE_CONFIG.name} is more than jewelry - it's a celebration of craftsmanship.
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#F2E9D8]">
              Each piece is handcrafted with 92.5% pure silver, ensuring lasting quality and timeless beauty.
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#F2E9D8]">
              From traditional designs to contemporary styles, our collection celebrates the art of silver jewelry making.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-center bg-[#2A2721]">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif italic text-[#aa732f] mb-6 sm:mb-8">{SITE_CONFIG.shortName}</h2>
              <p className="text-base sm:text-lg font-light text-[#aa732f] mb-6 sm:mb-8">
                Get exclusive updates on new collections and special offers
              </p>
            </div>
          </div>
        </section>

        <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-[#ae742b] text-center bg-[#2A2721] text-xs text-[#aa732f]">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;