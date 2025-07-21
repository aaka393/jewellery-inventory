import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Category } from '../types';
import { ApiResponse } from '../types/api';

class CategoryService extends BaseService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.get<Category[]>(API_ENDPOINTS.CATEGORIES);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<ApiResponse<Category>> {
    return this.post<Category>(API_ENDPOINTS.CREATE_CATEGORY, category, true);
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${API_ENDPOINTS.DELETE_CATEGORY}/${id}`, true);
  }
}

export const categoryService = new CategoryService();