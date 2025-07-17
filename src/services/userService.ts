import BaseService from './baseService';
import { User, Order, Address } from '../types';
import { ApiResponse } from '../types/api';

interface UserProfile extends User {
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  preferences?: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  addresses: Address[];
  lastLogin?: Date;
  isActive: boolean;
}

class UserService extends BaseService {
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.get<UserProfile>('/user/profile', true);
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.put<UserProfile>('/user/profile', profileData, true);
  }

  async getUserOrders(): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>('/user/orders', true);
  }

  async getUserWishlist(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>('/user/wishlist', true);
  }

  async addToWishlist(productId: string): Promise<ApiResponse<void>> {
    return this.post<void>('/user/wishlist', { productId }, true);
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/user/wishlist/${productId}`, true);
  }

  async getUserCart(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/cart', true);
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<void>> {
    return this.post<void>('/cart/add', { productId, quantity }, true);
  }

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<void>> {
    return this.put<void>('/cart/update', { productId, quantity }, true);
  }

  async removeFromCart(productId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/cart/remove/${productId}`, true);
  }

  async mergeCart(guestCartItems: any[]): Promise<ApiResponse<void>> {
    return this.post<void>('/cart/merge', { items: guestCartItems }, true);
  }
}

export const userService = new UserService();