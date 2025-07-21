import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { apiService } from '../services/api';
import { useCategoryStore } from '../store/categoryStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { SITE_CONFIG } from '../constants/siteConfig';
import Footer from '../components/common/Footer';
import Neckless from '../assets/Neckless.jpg';
import catalog from '../assets/Devi.jpg';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  const { setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
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

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate(`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEOHead
        title={`${SITE_CONFIG.name} - ${SITE_CONFIG.description} | Necklaces, Earrings, Bangles`}
        description={`Discover exquisite handcrafted pure silver jewelry at ${SITE_CONFIG.name}. Shop necklaces, earrings, bangles, anklets and more. Free shipping within India.`}
        keywords={`silver jewelry, handcrafted jewelry, necklaces, earrings, bangles, anklets, rings, Indian jewelry, ${SITE_CONFIG.name}, pure silver, 925 silver`}
      />
      
      <div className="bg-[#1C1A17] text-[#F2E9D8] overflow-hidden">
        {/* Hero Section with Staggered Animations */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full h-screen">
            <div className={`relative overflow-hidden transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}>
              <img
                src="https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero Left - Handcrafted Silver Jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1A17]/20"></div>
            </div>
            <div className={`relative overflow-hidden transform transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
              <img
                src={Neckless}
                alt="Hero Right - Pure Silver Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1C1A17]/20"></div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center z-10 transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="mb-6">
                {/* Typewriter Effect for Taanira */}
                <TypewriterText 
                  text={SITE_CONFIG.shortName} 
                  className="text-6xl md:text-8xl font-serif italic text-[#F2E9D8] mb-4"
                  delay={1200}
                />
              </div>
              <div className={`transform transition-all duration-1000 delay-1800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <p className="text-lg md:text-xl font-light tracking-wide text-[#D4B896] max-w-md mx-auto">
                  {SITE_CONFIG.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section with Staggered Animation */}
        <section className={`py-20 px-6 text-center max-w-4xl mx-auto transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#D4B896] italic">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-base md:text-lg font-light text-[#F2E9D8]">
              Discover our handcrafted pure silver jewelry collection.
            </p>
            <Link 
              to="/products"
              className="inline-block mt-8 text-sm tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors transform hover:scale-105 duration-300"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </section>

        {/* Shop by Category Section with Enhanced Animations */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className={`text-center mb-16 transform transition-all duration-1000 delay-1200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#F2E9D8] mb-8">Shop by Category</h2>
              <p className="text-lg font-light text-[#D4B896]">
                Explore our curated collections of handcrafted silver jewelry
              </p>
            </div>

            <div className="min-h-screen bg-[#1C1A17] p-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Enhanced Product Cards with Staggered Animations */}
                  {[
                    {
                      name: 'bangles',
                      title: 'Bangles',
                      subtitle: 'Handcrafted Silver Collection',
                      badge: 'FEATURED',
                      image1: 'https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772',
                      image2: 'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=600',
                      delay: 1400
                    },
                    {
                      name: 'jhumkas',
                      title: 'Jhumkas',
                      subtitle: 'Traditional Earrings',
                      badge: 'TRENDING',
                      image1: 'https://www.macsjewelry.com/cdn/shop/files/IMG_4362_594x.progressive.jpg?v=1701478781',
                      image2: 'https://images.pexels.com/photos/1454164/pexels-photo-1454164.jpeg?auto=compress&cs=tinysrgb&w=600',
                      delay: 1600
                    },
                    {
                      name: 'anklets',
                      title: 'Anklets',
                      subtitle: 'Elegant Foot Jewelry',
                      badge: 'NEW',
                      image1: 'https://www.macsjewelry.com/cdn/shop/files/IMG_4361_594x.progressive.jpg?v=1701478781',
                      image2: 'https://images.pexels.com/photos/1454165/pexels-photo-1454165.jpeg?auto=compress&cs=tinysrgb&w=600',
                      delay: 1800
                    },
                    {
                      name: 'necklaces',
                      title: 'Necklaces',
                      subtitle: 'Elegant Neck Jewelry',
                      badge: 'PREMIUM',
                      image1: 'https://images.pexels.com/photos/1454163/pexels-photo-1454163.jpeg?auto=compress&cs=tinysrgb&w=600',
                      image2: 'https://images.pexels.com/photos/1454168/pexels-photo-1454168.jpeg?auto=compress&cs=tinysrgb&w=600',
                      delay: 2000
                    }
                  ].map((category, index) => (
                    <div 
                      key={category.name}
                      className={`product-card relative group cursor-pointer transform transition-all duration-1000 hover:scale-105 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                      }`}
                      style={{ transitionDelay: `${category.delay}ms` }}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="relative overflow-hidden bg-[#2A2621] rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#D4B896] text-[#1C1A17] px-3 py-1 text-xs tracking-widest rounded-full">
                            {category.badge}
                          </span>
                        </div>
                        <div className="relative h-96 overflow-hidden">
                          <img
                            src={category.image1}
                            alt={`${category.title} - Handcrafted Pure Silver Jewelry`}
                            className="product-image absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110"
                          />
                          <img
                            src={category.image2}
                            alt={`${category.title} - Alternative View`}
                            className="product-image absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
                          />
                          {/* Overlay effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </div>
                      <div className="product-content mt-6 text-center">
                        <h3 className="text-xl font-serif text-[#F2E9D8] mb-2 group-hover:text-[#D4B896] transition-colors duration-300">
                          {category.title}
                        </h3>
                        <p className="text-sm text-[#D4B896] group-hover:text-[#F2E9D8] transition-colors duration-300">
                          {category.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* View All Products Button with Animation */}
              <div className={`text-center mt-32 transform transition-all duration-1000 delay-2200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
                <Link
                  to="/products"
                  className="bg-[#D4B896] text-[#1C1A17] px-12 py-4 text-sm tracking-widest hover:bg-[#F2E9D8] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  VIEW ALL PRODUCTS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Section with Parallax Effect */}
        <section className={`relative min-h-screen flex items-center transform transition-all duration-1000 delay-2400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
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
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8] transform transition-all duration-1000 delay-2600">
              {SITE_CONFIG.name} is more than jewelry - it's a celebration of craftsmanship.
            </p>
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8] transform transition-all duration-1000 delay-2800">
              Each piece is handcrafted with 92.5% pure silver, ensuring lasting quality and timeless beauty.
            </p>
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#F2E9D8] transform transition-all duration-1000 delay-3000">
              From traditional designs to contemporary styles, our collection celebrates the art of silver jewelry making.
            </p>
          </div>
        </section>

        {/* Newsletter Section with Animation */}
        <section className={`py-24 px-6 text-center transform transition-all duration-1000 delay-3200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="max-w-2xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#F2E9D8] mb-8">{SITE_CONFIG.shortName}</h2>
              <p className="text-lg font-light text-[#D4B896] mb-8">
                Get exclusive updates on new collections and special offers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <input
                type="email"
                placeholder="Enter Email"
                className="bg-transparent border-b border-[#D4B896] pb-2 text-[#F2E9D8] placeholder-[#D4B896] focus:outline-none focus:border-[#F2E9D8] min-w-[300px] transition-colors duration-300"
              />
              <button className="text-sm tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors duration-300 transform hover:scale-105">
                SUBSCRIBE →
              </button>
            </div>
            <p className="text-xs text-[#D4B896] max-w-lg mx-auto leading-relaxed">
              {SITE_CONFIG.name} may use your email address to send updates and offers. 
              You can always unsubscribe from marketing messages. Learn more via our Privacy Policy.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className={`py-12 px-6 border-t border-[#2A2621] text-center text-xs text-[#D4B896] transform transition-all duration-1000 delay-3400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <Footer/>
        </div>
      </div>
    </>
  );
};

// Typewriter Effect Component
const TypewriterText: React.FC<{ 
  text: string; 
  className?: string; 
  delay?: number;
  speed?: number;
}> = ({ text, className = '', delay = 0, speed = 150 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, isStarted, speed]);

  return (
    <h1 className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </h1>
  );
};

export default HomePage;