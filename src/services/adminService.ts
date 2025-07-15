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
    
    // Transform backend response to match frontend TableData interface
    if (response.data && response.data.result) {
      return response.data.result.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        images: product.images || [],
        preorderAvailable: product.preorderAvailable || false,
        inStock: product.inStock || false,
        specifications: product.specifications || {
          material: '',
          weight: '',
          dimensions: '',
          gemstone: ''
        },
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        featured: product.featured || false,
        // Add availability field for backward compatibility
        availability: product.inStock ? 'In Stock' : 'Out of Stock'
      }));
    }
    
    return [];
  },
};