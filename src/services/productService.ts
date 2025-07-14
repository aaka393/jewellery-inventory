import { apiClient } from './api';
import { Product, ProductFilter, ApiResponse, PaginatedResponse } from '../types';

export class ProductService {
  async getProducts(
    filter?: ProductFilter,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filter?.category) {
      params.append('category', filter.category);
    }
    if (filter?.priceRange) {
      params.append('minPrice', filter.priceRange.min.toString());
      params.append('maxPrice', filter.priceRange.max.toString());
    }
    if (filter?.inStock !== undefined) {
      params.append('inStock', filter.inStock.toString());
    }
    if (filter?.preorderOnly !== undefined) {
      params.append('preorderOnly', filter.preorderOnly.toString());
    }

    return apiClient.get<PaginatedResponse<Product>>(`/products?${params}`);
  }

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/category/${category}`);
    return response.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/featured');
    return response.data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products/${productId}/recommendations`);
    return response.data;
  }

  async importProducts(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.upload<ApiResponse<ImportResult>>('/products/import', formData);
    return response.data;
  }

  async validateImportFile(file: File): Promise<{ valid: boolean; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.upload<ApiResponse<{ valid: boolean; errors: string[] }>>('/products/validate-import', formData);
    return response.data;
  }
}

export const productService = new ProductService();