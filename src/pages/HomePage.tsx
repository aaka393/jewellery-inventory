import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG, staticImageBaseUrl } from '../constants/siteConfig';
import Footer from '../components/common/Footer';
import Neckless from '../assets/Neckless.jpg';
import catalog from '../assets/Devi.jpg';
import Header from '../components/common/Header';
import { motion } from 'framer-motion';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

<<<<<<< HEAD
  const addItem = useCartStore((state) => state.addItem);


=======
>>>>>>> 089b873 (Header are changes)
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('heroAnimated');
    if (!alreadyShown) {
      setHasAnimated(true);
      sessionStorage.setItem('heroAnimated', 'true');
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchProducts();
  }, []);

  const loadData = async () => {
    try {
      const categoriesRes = await apiService.getCategories();
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts();     
      const sortedProducts = (response || []).sort((a: Product, b: Product) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }       
        return Number(b.id) - Number(a.id);
      });
      
      setProducts(sortedProducts.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLetters = (text: string) =>
    text.split('').map((char, index) => (
      <motion.span key={index} variants={letter}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));

<<<<<<< HEAD
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
    addItem(product, 1);
    alert(`${product.name} added to cart!`);
  };

=======
>>>>>>> 089b873 (Header are changes)
  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEOHead
        title={`${SITE_CONFIG.name} - ${SITE_CONFIG.description} | Necklaces, Earrings, Bangles`}
        description={`Discover exquisite handcrafted pure silver jewelry at ${SITE_CONFIG.name}. Shop necklaces, earrings, bangles, anklets and more. Free shipping within India.`}
        keywords={`silver jewelry, handcrafted jewelry, necklaces, earrings, bangles, anklets, rings, Indian jewelry, ${SITE_CONFIG.name}, pure silver, 925 silver`}
      />
      <div className="text-[#F2E9D8] overflow-hidden bg-[#F2ECE4]">
        <Header />

        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
            <div className="relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero Left"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1A17]/30"></div>
            </div>
            <div className="relative overflow-hidden hidden lg:block">
              <img
                src={Neckless}
                alt="Hero Right"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 z-10">
              <motion.h1
                className="text-5xl md:text-7xl font-serif italic text-[#F2E9D8] mb-6"
                variants={container}
                initial="hidden"
                animate="visible"
              >
                {renderLetters(SITE_CONFIG.shortName)}
              </motion.h1>
              <motion.p
                className="text-base md:text-xl font-light tracking-wide text-[#D4B896] max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: hasAnimated ? 1.5 : 0, duration: 1 }}
              >
                {SITE_CONFIG.description}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto bg-[#F2ECE4]">
          <div className="space-y-6 ">
            <p className="text-lg md:text-xl font-light leading-relaxed font-semibold text-[#804000] italic">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-base md:text-lg font-light bold font-semibold text-[#804000]">
              Discover our handcrafted pure silver jewelry collection.
            </p>
            <Link
              to="/products"
              className="inline-block font-bold mt-8 text-sm text-[#804000] tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </section>

        {/* Product Cards Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 font-serif italic">
              <h2 className="text-3xl md:text-4xl font-light text-[#804000] mb-4 tracking-wide">
                Latest Products
              </h2>
              <div className="w-24 h-[1px] bg-[#D4B896] mx-auto mb-4"></div>
              <p className="text-[#804000] font-light max-w-2xl mx-auto mb-6">
                Discover our newest arrivals - Each piece is meticulously crafted with attention to detail, using only the finest materials
              </p>
            </div>

            {/* ✅ Updated Grid for Mobile: Two Products per Row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {products.map((product) => (
                <Link
                  to={`/product/${product.slug}`}
                  key={product.id}
                  className="flex flex-col items-center group"
                >
                  <div className="relative w-full aspect-[3/4] border-2 border-[#d4b896] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-transparent">
                    <img
                      src={`${staticImageBaseUrl}/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#D4B896] text-[#1C1A17] text-xs px-3 py-1 rounded-full font-medium">
                        PreOrder
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-sm sm:text-base text-[#aa732f] font-medium">{product.name}</h3>
                    <p className="text-sm text-[#aa732f] font-semibold">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-32">
              <Link
                to="/products"
                className="bg-[#D4B896] text-[#1C1A17] px-12 py-4 text-sm tracking-widest hover:bg-[#F2E9D8] transition-colors"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="relative min-h-screen flex items-end md:items-center">
          <div className="absolute inset-0">
            <img
              src={catalog}
              alt="Brand Catalog"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1C1A17]/40"></div>
          </div>
          <div className="relative z-10 w-full max-w-4xl px-6 pb-10 md:pb-0 text-left space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-white">
              {SITE_CONFIG.name} is more than jewelry - it's a celebration of craftsmanship.
            </p>
            <p className="text-lg md:text-xl font-light leading-relaxed text-white">
              Each piece is handcrafted with 92.5% pure silver, ensuring lasting quality and timeless beauty.
            </p>
            <p className="text-lg md:text-xl font-light leading-relaxed text-white">
              From traditional designs to contemporary styles, our collection celebrates the art of silver jewelry making.
            </p>
          </div>
        </section>
        {/* Footer */}
        <section className="py-24 px-6 text-center bg-[#F2ECE4]">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#4F3C2A] mb-8">{SITE_CONFIG.shortName}</h2>
              <p className="text-lg font-light text-[#4F3C2A] mb-8">
                Get exclusive updates on new collections and special offers
              </p>
            </div>
          </div>
        </section>

        <div className="py-12 px-6 border-t border-[#ae742b] text-center bg-[#F2ECE4] text-xs text-[#4F3C2A]">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
