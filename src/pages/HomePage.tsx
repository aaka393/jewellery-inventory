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
import catalog from '../assets/Devi.jpg'
const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { setSelectedCategory } = useCategoryStore();
  const navigate = useNavigate();

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
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full h-screen">
            <div className="relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/6624862/pexels-photo-6624862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Hero Left - Handcrafted Silver Jewelry"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1A17]/20"></div>
            </div>
            <div className="relative overflow-hidden">
              <img
                src={Neckless}
                alt="Hero Right - Pure Silver Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1C1A17]/20"></div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center z-10">
              <div className="mb-6">
                <h1 className="text-6xl md:text-8xl font-serif italic text-[#F2E9D8] mb-4">
                  {SITE_CONFIG.shortName}
                </h1>
              </div>
              <div>
                <p className="text-lg md:text-xl font-light tracking-wide text-[#D4B896] max-w-md mx-auto">
                  {SITE_CONFIG.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#D4B896] italic">
              {SITE_CONFIG.tagline}
            </p>
            <p className="text-base md:text-lg font-light text-[#F2E9D8]">
              Discover our handcrafted pure silver jewelry collection.
            </p>
            <Link 
              to="/products"
              className="inline-block mt-8 text-sm tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors"
            >
              EXPLORE COLLECTION →
            </Link>
          </div>
        </section>

        {/* Shop by Category Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#F2E9D8] mb-8">Shop by Category</h2>
              <p className="text-lg font-light text-[#D4B896]">
                Explore our curated collections of handcrafted silver jewelry
              </p>
            </div>

            <div className="min-h-screen bg-[#1C1A17] p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Bangles Card */}
                <div className="product-card relative group cursor-pointer" onClick={() => handleCategoryClick('bangles')}>
                  <div className="relative overflow-hidden bg-[#2A2621] rounded-lg">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#D4B896] text-[#1C1A17] px-3 py-1 text-xs tracking-widest">
                        FEATURED
                      </span>
                    </div>
                    <div className="relative h-96">
                      <img
                        src="https://www.macsjewelry.com/cdn/shop/files/IMG_4360_594x.progressive.jpg?v=1701478772"
                        alt="Silver Bangles - Handcrafted Pure Silver Jewelry"
                        className="product-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src="https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Silver Bangles - Alternative View"
                        className="product-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  <div className="product-content mt-6 text-center">
                    <h3 className="text-xl font-serif text-[#F2E9D8] mb-2 group-hover:text-[#D4B896] transition-colors duration-300">Bangles</h3>
                    <p className="text-sm text-[#D4B896] group-hover:text-[#F2E9D8] transition-colors duration-300">Handcrafted Silver Collection</p>
                  </div>
                </div>

                {/* Jhumkas Card */}
                <div className="product-card relative group cursor-pointer" onClick={() => handleCategoryClick('jhumkas')}>
                  <div className="relative overflow-hidden bg-[#2A2621] rounded-lg">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#D4B896] text-[#1C1A17] px-3 py-1 text-xs tracking-widest">
                        TRENDING
                      </span>
                    </div>
                    <div className="relative h-96">
                      <img
                        src="https://www.macsjewelry.com/cdn/shop/files/IMG_4362_594x.progressive.jpg?v=1701478781"
                        alt="Silver Jhumkas - Traditional Indian Earrings"
                        className="product-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src="https://images.pexels.com/photos/1454164/pexels-photo-1454164.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Silver Jhumkas - Alternative View"
                        className="product-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  <div className="product-content mt-6 text-center">
                    <h3 className="text-xl font-serif text-[#F2E9D8] mb-2 group-hover:text-[#D4B896] transition-colors duration-300">Jhumkas</h3>
                    <p className="text-sm text-[#D4B896] group-hover:text-[#F2E9D8] transition-colors duration-300">Traditional Earrings</p>
                  </div>
                </div>

                {/* Anklets Card */}
                <div className="product-card relative group cursor-pointer" onClick={() => handleCategoryClick('anklets')}>
                  <div className="relative overflow-hidden bg-[#2A2621] rounded-lg">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#D4B896] text-[#1C1A17] px-3 py-1 text-xs tracking-widest">
                        NEW
                      </span>
                    </div>
                    <div className="relative h-96">
                      <img
                        src="https://www.macsjewelry.com/cdn/shop/files/IMG_4361_594x.progressive.jpg?v=1701478781"
                        alt="Silver Anklets - Elegant Foot Jewelry"
                        className="product-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src="https://images.pexels.com/photos/1454165/pexels-photo-1454165.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Silver Anklets - Alternative View"
                        className="product-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  <div className="product-content mt-6 text-center">
                    <h3 className="text-xl font-serif text-[#F2E9D8] mb-2 group-hover:text-[#D4B896] transition-colors duration-300">Anklets</h3>
                    <p className="text-sm text-[#D4B896] group-hover:text-[#F2E9D8] transition-colors duration-300">Elegant Foot Jewelry</p>
                  </div>
                </div>

                {/* New Necklaces Card */}
                <div className="product-card relative group cursor-pointer" onClick={() => handleCategoryClick('necklaces')}>
                  <div className="relative overflow-hidden bg-[#2A2621] rounded-lg">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#D4B896] text-[#1C1A17] px-3 py-1 text-xs tracking-widest">
                        PREMIUM
                      </span>
                    </div>
                    <div className="relative h-96">
                      <img
                        src="https://images.pexels.com/photos/1454163/pexels-photo-1454163.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Silver Necklaces - Elegant Neck Jewelry"
                        className="product-image absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <img
                        src="https://images.pexels.com/photos/1454168/pexels-photo-1454168.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Silver Necklaces - Alternative View"
                        className="product-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  <div className="product-content mt-6 text-center">
                    <h3 className="text-xl font-serif text-[#F2E9D8] mb-2 group-hover:text-[#D4B896] transition-colors duration-300">Necklaces</h3>
                    <p className="text-sm text-[#D4B896] group-hover:text-[#F2E9D8] transition-colors duration-300">Elegant Neck Jewelry</p>
                  </div>
                </div>
              </div>
            </div>
             <div className="text-center mt-[200px]">
              <Link
                to="/products"
                className="bg-[#D4B896] text-[#1C1A17] px-12 py-4 text-sm tracking-widest hover:bg-[#F2E9D8] transition-colors"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
            </div>
          </div>
        </section>

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
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#F2E9D8] mb-8">{SITE_CONFIG.shortName}</h2>
              <p className="text-lg font-light text-[#D4B896] mb-8">
                Get exclusive updates on new collections and special offers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <input
                type="email"
                placeholder="Enter Email"
                className="bg-transparent border-b border-[#D4B896] pb-2 text-[#F2E9D8] placeholder-[#D4B896] focus:outline-none focus:border-[#F2E9D8] min-w-[300px]"
              />
              <button className="text-sm tracking-widest border-b border-[#D4B896] pb-1 hover:border-[#F2E9D8] transition-colors">
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
        <div className="py-12 px-6 border-t border-[#2A2621] text-center text-xs text-[#D4B896]">
           <Footer/>
        </div>
      </div>
    </>
  );
};

export default HomePage;