import BaseService from './baseService';
import { User } from '../types';
import { ApiResponse } from '../types/api';

interface UserProfile extends User {
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  preferences?: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  addresses: Address[];
  lastLogin?: string;
  isActive: boolean;
}

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
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
    return this.get<any[]>('/user/cart', true);
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