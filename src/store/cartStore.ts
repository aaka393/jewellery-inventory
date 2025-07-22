import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { useAuthStore } from './authStore';
import { cartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  guestItems: CartItem[];

  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;

  clearCart: () => void;
  mergeGuestCart: () => void;

  getTotalPrice: () => number;
  getItemCount: () => number;
  getProductQuantity: (productId: string) => number;
  isProductInCart: (productId: string) => boolean;
  syncWithServer: () => Promise<void>;
  resetCartStore: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      guestItems: [],

      addItem: async (product, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        const state = get();
        const targetItems = isAuthenticated ? state.items : state.guestItems;
        const existingItem = targetItems.find(item => item.productId === product.id);

        if (existingItem) {
          const updatedItems = targetItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );

          if (isAuthenticated) {
            set({ items: updatedItems });
            try {
              await cartService.updateCartItem(product.id, existingItem.quantity + quantity);
              await get().syncWithServer();
            } catch (err) {
              console.error(err);
            }
          } else {
            set({ guestItems: updatedItems });
          }
        } else {
          const newItem: CartItem = {
            id: isAuthenticated ? product.id : `${product.id}-${Date.now()}`,
            productId: product.id,
            quantity,
            product,
          };

          if (isAuthenticated) {
            set({ items: [...state.items, newItem] });
            try {
              await cartService.addToCart(product.id, quantity);
              await get().syncWithServer();
            } catch (err) {
              console.error(err);
            }
          } else {
            set({ guestItems: [...state.guestItems, newItem] });
          }
        }
      },

      removeItem: async (productId) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          set({ items: get().items.filter(item => item.productId !== productId) });
          try {
            await cartService.removeFromCart(productId);
            await get().syncWithServer();
          } catch (err) {
            console.error(err);
          }
        } else {
          set({ guestItems: get().guestItems.filter(item => item.productId !== productId) });
        }
      },

      updateQuantity: (productId, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          set({
            items: get().items.map(item =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
          cartService.updateCartItem(productId, quantity)
            .then(() => get().syncWithServer())
            .catch(console.error);
        } else {
          const guestItems = get().guestItems;
          const item = guestItems.find(item => item.productId === productId);
          if (!item) return;

          if (quantity <= 0) {
            set({ guestItems: guestItems.filter(item => item.productId !== productId) });
          } else {
            set({
              guestItems: guestItems.map(item =>
                item.productId === productId ? { ...item, quantity } : item
              ),
            });
          }
        }
      },

      clearCart: () => {
        const { isAuthenticated } = useAuthStore.getState();
        set({ [isAuthenticated ? 'items' : 'guestItems']: [] });
      },

      mergeGuestCart: async () => {
        const { guestItems, items } = get();
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated || guestItems.length === 0) return;

        try {
          await cartService.mergeCart(
            guestItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              product: item.product, // only used for frontend
            }))
          );

          const mergedItems = [...items];

          guestItems.forEach(guestItem => {
            const existing = mergedItems.find(i => i.productId === guestItem.productId);
            if (existing) {
              existing.quantity += guestItem.quantity;
            } else {
              mergedItems.push({
                ...guestItem,
                id: `${guestItem.productId}-${Date.now()}`,
              });
            }
          });

          set({ items: mergedItems, guestItems: [] });
        } catch (err) {
          console.error('Failed to merge guest cart:', err);
        }
      },

      getTotalPrice: () => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;
        return targetItems.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;
        return targetItems.reduce((count, item) => count + item.quantity, 0);
      },

      getProductQuantity: (productId: string) => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;
        return targetItems.find(item => item.productId === productId)?.quantity || 0;
      },

      isProductInCart: (productId: string) => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;
        return targetItems.some(item => item.productId === productId);
      },
      resetCartStore: () => {
        set({ items: [], guestItems: [] });
      },
      syncWithServer: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const response = await cartService.getCart();
          set({ items: response.result || [] });
        } catch (err) {
          console.error('Failed to sync cart:', err);
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: state => ({ guestItems: state.guestItems }), // persist only guest cart
    }
  )
);
