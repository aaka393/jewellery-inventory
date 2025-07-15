// stores/adminStore.ts
import { create } from 'zustand';
import { adminService } from '../services/adminService';
import { TableData } from '../types';

interface AdminStore {
  isUploading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  products: TableData[];
  fetchProducts: () => Promise<void>;
  uploadParsedProductData: (data: TableData[]) => Promise<void>;
  deleteAllProducts: () => Promise<void>;
  clearMessages: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isUploading: false,
  successMessage: null,
  errorMessage: null,
  products: [],

  fetchProducts: async () => {
    try {
      const data = await adminService.getProducts();
      set({ products: data });
    } catch (error: any) {
      set({ errorMessage: error.message || 'Failed to fetch products' });
    }
  },

  uploadParsedProductData: async (data: TableData[]) => {
    set({ isUploading: true, successMessage: null, errorMessage: null });
    try {
      const msg = await adminService.uploadParsedProductData(data);
      set({ successMessage: msg, isUploading: false });
    } catch (error: any) {
      set({
        errorMessage: error.message || 'Upload failed',
        isUploading: false,
      });
    }
  },

  deleteAllProducts: async () => {
    try {
      const msg = await adminService.deleteAllProducts();
      set({ successMessage: msg });
      const data = await adminService.getProducts();
      set({ products: data });
    } catch (error: any) {
      set({ errorMessage: error.message || 'Failed to delete products' });
    }
  },

  clearMessages: () => {
    set({ successMessage: null, errorMessage: null });
  },
}));
