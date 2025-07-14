import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, ProductCategory, ProductFilter, LoadingState } from '../types';
import { productService } from '../services/productService';

interface ProductStore extends LoadingState {
  // State
  products: Product[];
  selectedProduct: Product | null;
  selectedCategory: ProductCategory | null;
  filter: ProductFilter;
  searchQuery: string;
  featuredProducts: Product[];
  recommendations: Product[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedCategory: (category: ProductCategory | null) => void;
  setFilter: (filter: ProductFilter) => void;
  setSearchQuery: (query: string) => void;
  clearFilter: () => void;
  
  // Async actions
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchProductsByCategory: (category: ProductCategory) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  fetchRecommendations: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      products: [],
      selectedProduct: null,
      selectedCategory: null,
      filter: {},
      searchQuery: '',
      featuredProducts: [],
      recommendations: [],
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      isLoading: false,
      error: null,

      // Sync actions
      setProducts: (products) => set({ products }),
      
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      
      setSelectedCategory: (category) => 
        set((state) => ({
          selectedCategory: category,
          filter: { ...state.filter, category: category || undefined },
          currentPage: 1,
        })),
      
      setFilter: (filter) => 
        set((state) => ({
          filter: { ...state.filter, ...filter },
          currentPage: 1,
        })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      clearFilter: () => 
        set({
          filter: {},
          selectedCategory: null,
          searchQuery: '',
          currentPage: 1,
        }),

      // Async actions
      fetchProducts: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
          const { filter } = get();
          const response = await productService.getProducts(filter, page, 20);
          
          set({
            products: response.items,
            currentPage: response.page,
            totalPages: response.totalPages,
            totalProducts: response.total,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            isLoading: false,
          });
        }
      },

      fetchProductById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const product = await productService.getProductById(id);
          set({ selectedProduct: product, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch product',
            isLoading: false,
          });
        }
      },

      fetchProductsByCategory: async (category) => {
        set({ isLoading: true, error: null });
        try {
          const products = await productService.getProductsByCategory(category);
          set({
            products,
            selectedCategory: category,
            filter: { category },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            isLoading: false,
          });
        }
      },

      fetchFeaturedProducts: async () => {
        try {
          const products = await productService.getFeaturedProducts();
          set({ featuredProducts: products });
        } catch (error) {
          console.error('Failed to fetch featured products:', error);
        }
      },

      searchProducts: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const products = await productService.searchProducts(query);
          set({
            products,
            searchQuery: query,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to search products',
            isLoading: false,
          });
        }
      },

      fetchRecommendations: async (productId) => {
        try {
          const recommendations = await productService.getProductRecommendations(productId);
          set({ recommendations });
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      },
    }),
    { name: 'product-store' }
  )
);