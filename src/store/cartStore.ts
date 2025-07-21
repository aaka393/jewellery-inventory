import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { useAuthStore } from './authStore';
import { cartService } from '../services/cartService';

interface CartState {
  items: CartItem[];
  guestItems: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  mergeGuestCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  syncWithServer: () => Promise<void>;
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
          const newItem = {
            id: `${product.id}-${Date.now()}`,
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

      removeItem: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          set({
            items: get().items.filter(item => item.productId !== id),
          });
          try {
            await cartService.removeFromCart(id);
            await get().syncWithServer();
          } catch (err) {
            console.error(err);
          }
        } else {
          set({
            guestItems: get().guestItems.filter(item => item.productId !== id),
          });
        }
      },

      updateQuantity: (id, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          set({
            items: get().items.map(item =>
              item.productId === id
                ? { ...item, quantity }
                : item
            ),
          });
          cartService.updateCartItem(id, quantity)
            .then(() => get().syncWithServer())
            .catch(console.error);
        } else {
          set({
            guestItems: get().guestItems.map(item =>
              item.productId === id
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },


      clearCart: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          set({ items: [] });
        } else {
          set({ guestItems: [] });
        }
      },

      mergeGuestCart: () => {
        const { guestItems, items } = get();
        if (guestItems.length === 0) return;

        cartService.mergeCart(guestItems).catch(console.error);
        const mergedItems = [...items];

        guestItems.forEach(guestItem => {
          const existingItem = mergedItems.find(item => item.productId === guestItem.productId);
          if (existingItem) {
            existingItem.quantity += guestItem.quantity;
          } else {
            mergedItems.push({
              ...guestItem,
              id: `${guestItem.productId}-${Date.now()}`,
            });
          }
        });

        set({
          items: mergedItems,
          guestItems: [],
        });
      },

      getTotalPrice: () => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;

        return (targetItems || []).reduce((total, item) => {
          const price = item?.product?.price || 0;
          const quantity = item?.quantity || 0;
          return total + (price * quantity);
        }, 0);
      },

      getItemCount: () => {
        const { isAuthenticated } = useAuthStore.getState();
        const targetItems = isAuthenticated ? get().items : get().guestItems;

        return (targetItems || []).reduce((count, item) => count + (item?.quantity || 0), 0);
      },

      syncWithServer: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const serverCart = await cartService.getCart();
          set({ items: serverCart.result || [] });
        } catch (error) {
          console.error('Failed to sync cart with server:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
