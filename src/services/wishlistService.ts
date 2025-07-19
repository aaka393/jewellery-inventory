import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { WishlistItem } from '../types';
import { ApiResponse } from '../types/api';

class WishlistService extends BaseService {
  async addToWishlist(productId: string): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.ADD_TO_WISHLIST, { productId }, true);
  }

  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    return this.get<WishlistItem[]>(API_ENDPOINTS.GET_WISHLIST, true);
  }
}

export const wishlistService = new WishlistService();