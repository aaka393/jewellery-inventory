// Site configuration - centralized settings
export const staticImageBaseUrl = '/api/static/image/';

export const SITE_CONFIG = {
  name: process.env.VITE_SITE_NAME || 'JI Jewelry',
  shortName: process.env.VITE_SITE_SHORT_NAME || 'JI',
  description: process.env.VITE_SITE_DESCRIPTION || 'Handcrafted Pure Silver Jewelry',
  tagline: process.env.VITE_SITE_TAGLINE || 'A Tanishq Partnership. JI is India\'s first omnichannel jeweller offering best-in-class jewellery.',
  domain: process.env.VITE_SITE_DOMAIN || 'JIjewelry.com',
  supportEmail: process.env.VITE_SUPPORT_EMAIL || 'support@JIjewelry.com',
  supportPhone: process.env.VITE_SUPPORT_PHONE || '1800-102-0103',
  address: process.env.VITE_SITE_ADDRESS || 'Hyderabad Manikonda, Hyderabad',
  workingHours: process.env.VITE_WORKING_HOURS || '10:00 AM - 10:00 PM',
  
  // Social media
  social: {
    facebook: process.env.VITE_FACEBOOK_URL || '#',
    instagram: process.env.VITE_INSTAGRAM_URL || '#',
    twitter: process.env.VITE_TWITTER_URL || '#',
    youtube: process.env.VITE_YOUTUBE_URL || '#',
  },
  
  // Business settings
  freeShippingThreshold: parseInt(process.env.VITE_FREE_SHIPPING_THRESHOLD || '500'),
  internationalShippingCost: parseInt(process.env.VITE_INTERNATIONAL_SHIPPING_COST || '3000'),
  currency: process.env.VITE_CURRENCY || 'INR',
  currencySymbol: process.env.VITE_CURRENCY_SYMBOL || '₹',
  
  // Features
  features: {
    codEnabled: process.env.VITE_COD_ENABLED === 'true',
    returnsEnabled: process.env.VITE_RETURNS_ENABLED !== 'false',
    reviewsEnabled: process.env.VITE_REVIEWS_ENABLED !== 'false',
    wishlistEnabled: process.env.VITE_WISHLIST_ENABLED !== 'false',
  }
};