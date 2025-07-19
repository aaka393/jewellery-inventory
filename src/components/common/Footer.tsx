import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '../../constants/siteConfig';

const Footer: React.FC = () => {
  return (
    <footer className="">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {SITE_CONFIG.tagline}
            </p>
            <div className="flex space-x-4">
              <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
              <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              <li><Link to="/stores" className="text-gray-400 hover:text-white text-sm">Store Locator</Link></li>
              <li><Link to="/size-guide" className="text-gray-400 hover:text-white text-sm">Size Guide</Link></li>
              <li><Link to="/care-guide" className="text-gray-400 hover:text-white text-sm">Care Guide</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-md font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2">
              <li><Link to="/returns" className="text-gray-400 hover:text-white text-sm">Returns & Exchange</Link></li>
              <li><Link to="/warranty" className="text-gray-400 hover:text-white text-sm">Warranty</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white text-sm">Shipping Info</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white text-sm">FAQ</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📞 {SITE_CONFIG.supportPhone}</p>
              <p>✉️ {SITE_CONFIG.supportEmail}</p>
              <p>📍 {SITE_CONFIG.address}</p>
              <p>🕒 {SITE_CONFIG.workingHours}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;