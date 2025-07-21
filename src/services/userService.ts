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

  async getUserOrders(id: string): Promise<ApiResponse<UserProfile[]>> {
    return this.get<UserProfile[]>(`/user/${id}/orders/`, true);
  }

  async getUserCart(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>('/cart', true);
  }

  async addToCart(id: string, quantity: number): Promise<ApiResponse<void>> {
    return this.post<void>('/cart/add', { id, quantity }, true);
  }

  async updateCartItem(id: string, quantity: number): Promise<ApiResponse<void>> {
  return this.put<void>(`/cart/update/${id}?quantity=${quantity}`, null, true);
}

  async removeFromCart(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/cart/remove/${id}`, true);
  }

  async mergeCart(guestCartItems: any[]): Promise<ApiResponse<void>> {
    return this.post<void>('/cart/merge', { items: guestCartItems }, true);
  }
}

export const userService = new UserService();