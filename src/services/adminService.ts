import BaseService from './baseService';
import { Order, User } from '../types';
import { ApiResponse } from '../types/api';
import { API_ENDPOINTS } from '../constants/appConstants';

interface ProductStats {
  totalProducts: number;
  stock: number;
  categories: Record<string, number>;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

class AdminService extends BaseService {
  // Product
  async updateProductVisibility(productId: string, visible: boolean): Promise<ApiResponse<void>> {
    return this.put<void>(`${API_ENDPOINTS.UPDATE_PRODUCT_VISIBILITY}/${productId}/visibility`, { visible }, true);
  }

  async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return this.get<ProductStats>(API_ENDPOINTS.ADMIN_PRODUCT_STATS, true);
  }

  // Order
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(API_ENDPOINTS.ADMIN_ORDERS, true);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<void>> {
    return this.put<void>(`${API_ENDPOINTS.UPDATE_ORDER_STATUS}/${orderId}/status`, { status }, true);
  }

  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return this.get<OrderStats>(API_ENDPOINTS.ADMIN_ORDER_STATS, true);
  }

  // User
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>(API_ENDPOINTS.ADMIN_USERS, true);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<void>> {
    return this.put<void>(`${API_ENDPOINTS.ADMIN_USER_ROLE}/${userId}/role`, { role }, true);
  }

  // Category
  async updateCategoryOrder(categoryIds: string[]): Promise<ApiResponse<void>> {
    return this.put<void>(API_ENDPOINTS.UPDATE_CATEGORY_ORDER, { categoryIds }, true);
  }

  // Manual Tracking
  async addManualTracking(userId: string, trackingId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`${API_ENDPOINTS.ADMIN_USERS}/${userId}/tracking`, { trackingId }, true);
  }
}

export const adminService = new AdminService();
