import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem, Product } from '../types';

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === product.id);
        
        if (!existingItem) {
          set({
            items: [...items, {
              id: `${product.id}-${Date.now()}`,
              productId: product.id,
              product,
            }],
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId),
        });
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);