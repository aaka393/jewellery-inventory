import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TableData } from '../types';
import { adminService } from '../services/adminService';

interface ProductState {
  products: TableData[];
  isLoading: boolean;
  error: string | null;
  addProducts: (newProducts: TableData[]) => void;
  fetchProducts: () => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<TableData>) => void;
  deleteProduct: (id: string) => void;
  clearProducts: () => void;
  getProductById: (id: string) => TableData | undefined;
  getProductsByCategory: (category: string) => TableData[];
  searchProducts: (query: string) => TableData[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const products = await adminService.getProducts();
          set({ products, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Failed to fetch products', 
            isLoading: false 
          });
        }
      },

      addProducts: (newProducts: TableData[]) => {
        const productsWithIds = newProducts.map((product, index) => ({
          ...product,
          id: product.id || `jewelry-${Date.now()}-${index}`,
          category: product.category || getProductCategory(product.description),
          availability: product.inStock ? 'In Stock' : 'Out of Stock'
        }));

        set((state) => ({
          products: [...state.products, ...productsWithIds]
        }));
      },

      updateProduct: (id: string, updatedProduct: Partial<TableData>) => {
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updatedProduct } : product
          )
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
      },

      clearProducts: () => {
        set({ products: [] });
      },

      getProductById: (id: string) => {
        return get().products.find(product => product.id === id);
      },

      getProductsByCategory: (category: string) => {
        const products = get().products;
        if (category === 'All') return products;
        return products.filter(product => 
          product.category?.toLowerCase() === category.toLowerCase()
        );
      },

      searchProducts: (query: string) => {
        const products = get().products;
        const lowercaseQuery = query.toLowerCase();
        return products.filter(product =>
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.price.toString().includes(lowercaseQuery) ||
          (product.category && product.category.toLowerCase().includes(lowercaseQuery))
        );
      }
    }),
    {
      name: 'jewelry-products-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Helper function to categorize products
const getProductCategory = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('gold')) return 'Gold';
  if (desc.includes('silver')) return 'Silver';
  if (desc.includes('platinum')) return 'Platinum';
  if (desc.includes('diamond')) return 'Diamond';
  return 'Gold'; // Default fallback
};