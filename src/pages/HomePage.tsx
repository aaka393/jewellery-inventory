import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import { Category } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import Footer from '../components/common/Footer';
import Neckless from '../assets/Neckless.jpg';
import catalog from '../assets/Devi.jpg'
import Header from '../components/common/Header';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Animation for each letter
const letter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
 const [hasAnimated, setHasAnimated] = useState(false);

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
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
    
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categoriesRes = await apiService.getCategories();
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }
const jewelryProducts = [
  {
    id: 1,
    name: "Celestial Moon Ring",
    price: "$189",
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 5,
    isNew: true,
    isSoldOut: false
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    price: "$245",
    image: "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1454169/pexels-photo-1454169.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 5,
    isNew: false,
    isSoldOut: false
  },
  {
    id: 3,
    name: "Infinity Bracelet",
    price: "$159",
    image: "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/1721938/pexels-photo-1721938.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 4,
    isNew: true,
    isSoldOut: true
  },
  {
    id: 4,
    name: "Diamond Tennis Necklace",
    price: "$389",
    image: "https://images.pexels.com/photos/1454169/pexels-photo-1454169.jpeg?auto=compress&cs=tinysrgb&w=800",
    hoverImage: "https://images.pexels.com/photos/2735037/pexels-photo-2735037.jpeg?auto=compress&cs=tinysrgb&w=800",
    rating: 5,
    isNew: false,
    isSoldOut: false
  },
];
  return (
    <>
      <SEOHead
        title={`${SITE_CONFIG.name} - ${SITE_CONFIG.description} | Necklaces, Earrings, Bangles`}
        description={`Discover exquisite handcrafted pure silver jewelry at ${SITE_CONFIG.name}. Shop necklaces, earrings, bangles, anklets and more. Free shipping within India.`}
        keywords={`silver jewelry, handcrafted jewelry, necklaces, earrings, bangles, anklets, rings, Indian jewelry, ${SITE_CONFIG.name}, pure silver, 925 silver`}
      />
      
      <div className=" text-[#F2E9D8] overflow-hidden">
         <Header />
        {/* Hero Section */}
          <section className="min-h-screen relative flex items-center justify-center">
          {/* Images Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen">
            {/* Left Image (Always visible) */}
            <div className="relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero Left - Handcrafted Silver Jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1A17]/30"></div>
            </div>

            {/* Right Image (Hidden on mobile) */}
            <div className="relative overflow-hidden hidden lg:block">
              <img
                src={Neckless}
                alt="Hero Right - Pure Silver Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text Overlay */}
         <div className="absolute inset-0 flex items-center justify-center">
     <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-4 z-10">
        {/* Animated Heading */}
        <motion.h1
          className="text-5xl md:text-7xl font-serif italic text-[#F2E9D8] mb-6"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {renderLetters(SITE_CONFIG.shortName)}
        </motion.h1>

        {/* Animated Paragraph */}
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
    </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#804000] italic">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-base md:text-lg font-light bold text-[#804000]">
              Discover our handcrafted pure silver jewelry collection.
            </p>
            <Link 
              to="/products"
              className="inline-block mt-8 text-sm text-[#804000] tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </section>

        <div className="min-h-screen ">
    
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 font-serif italic">
          <h2 className="text-3xl md:text-4xl font-light text-[#804000] mb-4 tracking-wide">
            Shop by Category
          </h2>
          <div className="w-24 h-[1px] bg-[#D4B896] mx-auto mb-4"></div>
          <p className="text-[#804000] font-light max-w-2xl mx-auto mb-6">
            Each piece is meticulously crafted with attention to detail, using only the finest materials
          </p>

          <div className="mt-10">
            <h3 className="text-2xl text-[#804000] mb-2">Our Collections</h3>
            <p className="text-[#804000]">Discover our handcrafted collections of handcrafted silver jewelry</p>
          </div>
          </div>
    {/* Desktop: 4 columns, Tablet: 3, Mobile: 2 */}
 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
  {jewelryProducts.map((product) => (
    <div key={product.id} className="flex flex-col items-center">
      
      {/* Card Container */}
      <div className="group relative w-full aspect-[3/4] border border-[#d4b896]/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-transparent">

        {/* Image Area */}
        <div className="relative w-full h-full flex items-center justify-center p-4">

          {/* Image Container with Golden Border */}
          <div className="relative p-3 border-2  border-[#d4b896] rounded-xl z-10 bg-transparent">
            <img
              src={product.image}
              alt={product.name}
              className="w-[80%] h-auto ml-[20px] object-contain"
            />
          </div>

          {/* Hover Full Cover Image */}
          <img
            src={product.hoverImage}
            alt={`${product.name} - Hover`}
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
          />

          {/* BADGES */}
          {product.isSoldOut && (
            <span className="absolute top-3 left-3 z-30 bg-white text-[#1d1a15] text-xs font-semibold px-2 py-1 rounded tracking-wide">
              SOLD OUT
            </span>
          )}
          {product.isNew && !product.isSoldOut && (
            <span className="absolute top-3 left-3 z-30 bg-[#d4b896] text-[#1d1a15] text-xs font-semibold px-2 py-1 rounded-full tracking-wide">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Title and Price */}
      <div className="text-center mt-4">
        <h3 className="text-sm sm:text-base text-[#f4efe6]">{product.name}</h3>
        <p className="text-sm text-[#d4b896] font-semibold">{product.price}</p>
      </div>
    </div>
  ))}
</div>






          {/* View All Button */}
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

    </div>

        {/* Brand Section */}
       <section className="relative min-h-screen flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={catalog}
                alt="Brand - Handcrafted Silver Jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1C1A17]/40"></div>
            </div>

            {/* Left-aligned Content */}
            <div className="relative z-10 w-full max-w-4xl px-6 text-left space-y-6">
              <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8]">
                {SITE_CONFIG.name} is more than jewelry - it's a celebration of craftsmanship.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8]">
                Each piece is handcrafted with 92.5% pure silver, ensuring lasting quality and timeless beauty.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8]">
                From traditional designs to contemporary styles, our collection celebrates the art of silver jewelry making.
              </p>
            </div>
          </section>


        {/* Newsletter Section */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#aa732f] mb-8">{SITE_CONFIG.shortName}</h2>
              <p className="text-lg font-light text-[#aa732f] mb-8">
                Get exclusive updates on new collections and special offers
              </p>
            </div>
            <p className="text-xs font-semibold  text-[#aa732f] max-w-lg mx-auto leading-relaxed">
              {SITE_CONFIG.name} may use your email address to send updates and offers. 
              You can always unsubscribe from marketing messages. Learn more via our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="py-12 px-6 border-t border-[#2A2621] text-center text-xs text-[#aa732f]">
           <Footer/>
        </div>
      </div>
    </>
  );
};

export default HomePage;