import BaseService from './baseService';
import { Order, User } from '../types';
import { ApiResponse } from '../types/api';


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

  async updateProductVisibility(productId: string, visible: boolean): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/products/${productId}/visibility`, { visible }, true);
  }

  async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return this.get<ProductStats>('/admin/stats/products', true);
  }

  // Order Management
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>('/admin/orders', true);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/orders/${orderId}/status`, { status }, true);
  }

  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return this.get<OrderStats>('/admin/stats/orders', true);
  }

  // User Management
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/admin/users', true);
  }

  async updateUserRole(userId: string, role: string): Promise<ApiResponse<void>> {
    return this.put<void>(`/admin/users/${userId}/role`, { role }, true);
  }

  // Category Management
  async updateCategoryOrder(categoryIds: string[]): Promise<ApiResponse<void>> {
    return this.put<void>('/admin/categories/order', { categoryIds }, true);
  }
}

export const adminService = new AdminService();