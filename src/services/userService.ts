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
}

export const userService = new UserService();