import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Tag } from '../types';
import { ApiResponse } from '../types/api';

class TagService extends BaseService {
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.get<Tag[]>(API_ENDPOINTS.TAGS);
  }

  async createTag(tag: Omit<Tag, 'id'>): Promise<ApiResponse<Tag>> {
    return this.post<Tag>(API_ENDPOINTS.CREATE_TAG, tag, true);
  }

  async updateProductTags(productId: string, tags: string[]): Promise<ApiResponse<void>> {
    return this.put<void>(`${API_ENDPOINTS.UPDATE_PRODUCT_TAGS}/${productId}/tags`, { tags }, true);
  }
}

export const tagService = new TagService();