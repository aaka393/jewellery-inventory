import BaseService from './baseService';
import { Product } from '../types';
import { ApiResponse } from '../types/api';

interface SearchSuggestion {
  query: string;
  type: 'product' | 'category' | 'tag';
  count: number;
}

interface SearchFilters {
  q?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  tags?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  suggestions?: SearchSuggestion[];
}

class SearchService extends BaseService {
  async searchProducts(filters: SearchFilters): Promise<ApiResponse<SearchResponse>> {
    const queryParams = new URLSearchParams();
    
    if (filters.q) queryParams.append('q', filters.q);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.price_min) queryParams.append('price_min', filters.price_min.toString());
    if (filters.price_max) queryParams.append('price_max', filters.price_max.toString());
    if (filters.tags) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    return this.get<SearchResponse>(`/products/search?${queryParams.toString()}`);
  }

  async getSearchSuggestions(query: string): Promise<ApiResponse<SearchSuggestion[]>> {
    return this.get<SearchSuggestion[]>(`/products/suggestions?q=${encodeURIComponent(query)}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>('/products/featured');
  }

  async getProductsByTag(tag: string): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>(`/products/by-tag/${encodeURIComponent(tag)}`);
  }
}

export const searchService = new SearchService();