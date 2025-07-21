import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '../../constants/siteConfig';

const Footer: React.FC = () => {
  return (
    <footer className=" text-[#aa732f] font-light">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-serif italic font-medium text-[#aa732f] mb-4">{SITE_CONFIG.name}</h3>
            <p className="text-sm leading-relaxed font-semibold mb-6">{SITE_CONFIG.tagline}</p>
            <div className="flex space-x-4">
              <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-[#aa732f] font-semibold hover:text-[#F2E9D8] transition-colors" />
              </a>
              <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-[#aa732f] font-semibold hover:text-[#F2E9D8] transition-colors" />
              </a>
              <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-[#aa732f] font-semibold hover:text-[#F2E9D8] transition-colors" />
              </a>
              <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 text-[#aa732f] font-semibold hover:text-[#F2E9D8] transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif italic font-semibold text-[#aa732f] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-[#aa732f] font-semibold transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#aa732f] font-semibold transition-colors">Contact Us</Link></li>
              <li><Link to="/stores" className="hover:text-[#aa732f] font-semibold transition-colors">Store Locator</Link></li>
              <li><Link to="/size-guide" className="hover:text-[#aa732f] font-semibold  transition-colors">Size Guide</Link></li>
              <li><Link to="/care-guide" className="hover:text-[#aa732f] font-semibold transition-colors">Care Guide</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-serif italic font-semibold text-[#aa732f] mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/returns" className="hover:text-[#F2E9D8] font-semibold transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/warranty" className="hover:text-[#F2E9D8] font-semibold transition-colors">Warranty</Link></li>
              <li><Link to="/shipping" className="hover:text-[#F2E9D8] font-semibold transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq" className="hover:text-[#F2E9D8] font-semibold transition-colors">FAQ</Link></li>
              <li><Link to="/track-order" className="hover:text-[#F2E9D8] font-semibold transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif italic font-semibold text-[#aa732f] mb-4">Contact Info</h4>
            <div className="space-y-2 font-semibold text-sm">
              <p>📞 {SITE_CONFIG.supportPhone}</p>
              <p>✉️ {SITE_CONFIG.supportEmail}</p>
              <p>📍 {SITE_CONFIG.address}</p>
              <p>🕒 {SITE_CONFIG.workingHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#aa732f] font-semibold mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-[#D4B896] mb-4 md:mb-0">© 2024 {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6">
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