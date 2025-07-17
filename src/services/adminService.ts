import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Product, Category, Tag } from '../types';
import { ApiResponse } from '../types/api';

interface BulkProductData {
  products: Partial<Product>[];
}

interface ProductStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  featured: number;
  categories: { [key: string]: number };
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

class AdminService extends BaseService {
  // Product Management
  async bulkCreateProducts(products: Partial<Product>[]): Promise<ApiResponse<Product[]>> {
    return this.post<Product[]>('/admin/products/bulk', { products }, true);
  }

  async updateProductVisibility(productId: string, visible: boolean): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/products/${productId}/visibility`, { visible }, true);
  }

  async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return this.get<ProductStats>('/admin/stats/products', true);
  }

  // Order Management
  async getAllOrders(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/admin/orders', true);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/orders/${orderId}/status`, { status }, true);
  }

  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return this.get<OrderStats>('/admin/stats/orders', true);
  }

  // User Management
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/admin/users', true);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/users/${userId}/role`, { role }, true);
  }

  // Tag Management
  async bulkUpdateProductTags(updates: { productId: string; tags: string[] }[]): Promise<ApiResponse<void>> {
    return this.post<void>('/admin/products/tags/bulk', { updates }, true);
  }

  async getTagUsageStats(): Promise<ApiResponse<{ [key: string]: number }>> {
    return this.get<{ [key: string]: number }>('/admin/stats/tags', true);
  }

  // Category Management
  async updateCategoryOrder(categoryIds: string[]): Promise<ApiResponse<void>> {
    return this.put<void>('/admin/categories/order', { categoryIds }, true);
  }

  // Reviews Management
  async getAllReviews(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/admin/reviews', true);
  }

  async moderateReview(reviewId: string, approved: boolean): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/reviews/${reviewId}/moderate`, { approved }, true);
  }
}

export const adminService = new AdminService();