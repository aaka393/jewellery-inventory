import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { CartItem } from '../types';
import { ApiResponse } from '../types/api';

class CartService extends BaseService {
  async addToCart(productId: string, quantity: number): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.ADD_TO_CART, { productId, quantity }, true);
  }

  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return this.get<CartItem[]>(API_ENDPOINTS.GET_CART, true);
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

export const cartService = new CartService();