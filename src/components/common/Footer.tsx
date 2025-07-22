import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '../../constants/siteConfig';

const Footer: React.FC = () => {
  return (
    <footer className=" text-[#4F3C2A] font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* Company Info */}
          <div>
            <h3 className="text-xl sm:text-2xl font-serif italic font-medium text-[#4F3C2A] mb-3 sm:mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-xs sm:text-sm leading-relaxed font-semibold mb-4 sm:mb-6">{SITE_CONFIG.tagline}</p>
            <div className="flex space-x-3 sm:space-x-4">
            <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" title='Facebook'>
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-[#1877F2] hover:text-[#145DBF] transition-colors" />
            </a>
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" title='Instagram'>
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-[#E4405F] hover:text-[#C13584] transition-colors" />
            </a>
            <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer" title='Twitter'>
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-[#1DA1F2] hover:text-[#0d8ddb] transition-colors" />
            </a>
            <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" title='YouTube'>
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF0000] hover:text-[#CC0000] transition-colors" />
            </a>
          </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-serif italic font-semibold text-[#4F3C2A] mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/about" className="hover:text-[#aa732f] font-semibold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#aa732f] font-semibold transition-colors">Contact Us</Link></li>
              <li><Link to="/stores" className="hover:text-[#aa732f] font-semibold transition-colors">Store Locator</Link></li>
              <li><Link to="/size-guide" className="hover:text-[#aa732f] font-semibold  transition-colors">Size Guide</Link></li>
              <li><Link to="/care-guide" className="hover:text-[#aa732f] font-semibold transition-colors">Care Guide</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-base sm:text-lg font-serif italic font-semibold text-[#4F3C2A] mb-3 sm:mb-4">Customer Care</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/returns" className="hover:text-[#F2E9D8] font-semibold transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/warranty" className="hover:text-[#F2E9D8] font-semibold transition-colors">Warranty</Link></li>
              <li><Link to="/shipping" className="hover:text-[#F2E9D8] font-semibold transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="hover:text-[#F2E9D8] font-semibold transition-colors">FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-[#F2E9D8] font-semibold transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-serif italic font-semibold text-[#4F3C2A] mb-3 sm:mb-4">Contact Info</h4>
            <div className="space-y-1.5 sm:space-y-2 font-semibold text-xs sm:text-sm">
              <p>📞 {SITE_CONFIG.supportPhone}</p>
              <p>✉️ {SITE_CONFIG.supportEmail}</p>
              <p>📍 {SITE_CONFIG.address}</p>
              <p>🕒 {SITE_CONFIG.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#aa732f] font-semibold mt-12 sm:mt-16 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs space-y-4 sm:space-y-0">
          <p className="text-[#4F3C2A] text-center sm:text-left">© 2024 {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <Link to="/privacy" className="hover:text-[#F2E9D8] font-semibold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#F2E9D8] font-semibold transition-colors">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-[#F2E9D8] font-semibold transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;