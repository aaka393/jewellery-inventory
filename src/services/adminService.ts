// services/adminService.ts
import { api } from './authService';
import { TableData } from '../types';

export const adminService = {
  uploadParsedProductData: async (products: TableData[]): Promise<string> => {
    const cleaned = products.map(product => ({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      images: product.images,
      preorderAvailable: product.preorderAvailable,
      inStock: product.inStock,
      specifications: product.specifications,
      rating: product.rating,
      reviews: product.reviews,
      featured: product.featured,
    }));

    const response = await api.post('/importproducts', cleaned);
    return response.data.message || 'Upload successful';
  },

  getProducts: async (): Promise<TableData[]> => {
    const response = await api.get('/auth/products');
    return response.data;
  },
};
