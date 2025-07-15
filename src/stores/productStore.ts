import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TableData } from '../types';

interface ProductState {
  products: TableData[];
  addProducts: (newProducts: TableData[]) => void;
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

      addProducts: (newProducts: TableData[]) => {
        const productsWithIds = newProducts.map((product, index) => ({
          ...product,
          id: product.id || `jewelry-${Date.now()}-${index}`,
          category: product.category || getProductCategory(product.description)
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
        return products.filter(product => product.category === category);
      },

      searchProducts: (query: string) => {
        const products = get().products;
        const lowercaseQuery = query.toLowerCase();
        return products.filter(product =>
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.price.toLowerCase().includes(lowercaseQuery) ||
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
