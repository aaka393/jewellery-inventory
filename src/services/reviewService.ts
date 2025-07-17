import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Review } from '../types';
import { ApiResponse } from '../types/api';

class ReviewService extends BaseService {
  async getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
    return this.get<Review[]>(`${API_ENDPOINTS.PRODUCT_REVIEWS}/${productId}/reviews`);
  }

  async addReview(productId: string, review: Omit<Review, 'id' | 'productId' | 'createdAt'>): Promise<ApiResponse<Review>> {
    return this.post<Review>(`${API_ENDPOINTS.ADD_REVIEW}/${productId}/reviews`, review, true);
  }
}

export const reviewService = new ReviewService();