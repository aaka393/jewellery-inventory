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
}

export const cartService = new CartService();