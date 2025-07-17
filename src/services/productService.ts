import BaseService from './baseService';
import { API_ENDPOINTS } from '../constants/appConstants';
import { Product, ProductFilters, ProductImport } from '../types';
import { ApiResponse } from '../types/api';

class ProductService extends BaseService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.get<Product>(`${API_ENDPOINTS.PRODUCT_BY_SLUG}/${slug}`);
  }

  async filterProducts(filters: ProductFilters): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.price_min) queryParams.append('price_min', filters.price_min.toString());
    if (filters.price_max) queryParams.append('price_max', filters.price_max.toString());
    if (filters.tags) {
      filters.tags.forEach(tag => queryParams.append('tags', tag));
    }

    const endpoint = `${API_ENDPOINTS.FILTER_PRODUCTS}?${queryParams.toString()}`;
    return this.get<Product[]>(endpoint);
  }

  async importProducts(products: ProductImport[]): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.IMPORT_PRODUCTS, products, true);
  }

  async uploadProductImage(file: File): Promise<ApiResponse<{ url: string }>> {
    return this.uploadFile<{ url: string }>(API_ENDPOINTS.UPLOAD_IMAGE, file, true);
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    const url = `${API_ENDPOINTS.UPDATE_PRODUCT}/${productId}`;
    return this.put<Product>(url, productData);
  }

    async deleteProductById(productId: string): Promise<ApiResponse<void>> {
    const url = `${API_ENDPOINTS.DELETE_PRODUCT}/${productId}`;
    return this.delete<void>(url, true);
  }

  async deleteProducts(): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.DELETE_PRODUCTS, true);
  }
}

export const productService = new ProductService();