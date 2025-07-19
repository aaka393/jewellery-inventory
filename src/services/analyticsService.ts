import BaseService from './baseService';
import { ApiResponse } from '../types/api';

interface PopularProduct {
  productId: string;
  name: string;
  viewCount: number;
  salesCount: number;
  revenue: number;
}

interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: PopularProduct[];
  revenueByMonth: { month: string; revenue: number }[];
}

interface UserActivity {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  usersByLocation: { location: string; count: number }[];
  topSearchQueries: { query: string; count: number }[];
}

interface AnalyticsEvent {
  type: 'product_view' | 'purchase' | 'search' | 'add_to_cart' | 'add_to_wishlist';
  userId?: string;
  productId?: string;
  sessionId: string;
  data?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

class AnalyticsService extends BaseService {
  async getPopularProducts(): Promise<ApiResponse<PopularProduct[]>> {
    return this.get<PopularProduct[]>('/analytics/products/popular');
  }

  async getSalesSummary(): Promise<ApiResponse<SalesSummary>> {
    return this.get<SalesSummary>('/analytics/sales/summary');
  }

  async getUserActivity(): Promise<ApiResponse<UserActivity>> {
    return this.get<UserActivity>('/analytics/users/activity');
  }

  async trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): Promise<void> {
    const sessionId = this.getSessionId();
    const eventData: AnalyticsEvent = {
      ...event,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    try {
      await this.post('/analytics/track', eventData);
    } catch (error) {
      // Analytics tracking should not break the app
      console.warn('Analytics tracking failed:', error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Track specific events
  async trackProductView(productId: string, userId?: string): Promise<void> {
    await this.trackEvent({
      type: 'product_view',
      productId,
      userId,
    });
  }

  async trackPurchase(orderId: string, userId?: string, total?: number): Promise<void> {
    await this.trackEvent({
      type: 'purchase',
      userId,
      data: { orderId, total },
    });
  }

  async trackSearch(query: string, userId?: string, resultCount?: number): Promise<void> {
    await this.trackEvent({
      type: 'search',
      userId,
      data: { query, resultCount },
    });
  }

  async trackAddToCart(productId: string, userId?: string): Promise<void> {
    await this.trackEvent({
      type: 'add_to_cart',
      productId,
      userId,
    });
  }

  async trackAddToWishlist(productId: string, userId?: string): Promise<void> {
    await this.trackEvent({
      type: 'add_to_wishlist',
      productId,
      userId,
    });
  }
}

export const analyticsService = new AnalyticsService();