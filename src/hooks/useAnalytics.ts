import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = () => {
  const { user } = useAuthStore();

  const trackProductView = (productId: string) => {
    analyticsService.trackProductView(productId, user?.id);
  };

  const trackPurchase = (orderId: string, total: number) => {
    analyticsService.trackPurchase(orderId, user?.id, total);
  };

  const trackSearch = (query: string, resultCount: number) => {
    analyticsService.trackSearch(query, user?.id, resultCount);
  };

  const trackAddToCart = (productId: string) => {
    analyticsService.trackAddToCart(productId, user?.id);
  };

  const trackAddToWishlist = (productId: string) => {
    analyticsService.trackAddToWishlist(productId, user?.id);
  };

  return {
    trackProductView,
    trackPurchase,
    trackSearch,
    trackAddToCart,
    trackAddToWishlist,
  };
};