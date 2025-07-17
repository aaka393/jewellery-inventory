import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import { useAuthStore } from './authStore';

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
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      guestItems: [],
      addItem: (product, quantity) => {
        const { isAuthenticated } = useAuthStore.getState();
        const items = get().items;
        const targetItems = isAuthenticated ? items : get().guestItems;
        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          const updatedItems = targetItems.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          
          if (isAuthenticated) {
            set({ items: updatedItems });
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
            set({ items: [...items, newItem] });
          } else {
            set({ guestItems: [...get().guestItems, newItem] });
          }
        }
      },
      removeItem: (productId) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          set({
            items: get().items.filter(item => item.productId !== productId),
          });
        } else {
          set({
            guestItems: get().guestItems.filter(item => item.productId !== productId),
          });
        }
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          set({
            items: get().items.map(item =>
              item.productId === productId
                ? { ...item, quantity }
                : item
            ),
          });
        } else {
          set({
            guestItems: get().guestItems.map(item =>
              item.productId === productId
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
    }),
    {
      name: 'cart-storage',
    }
  )
);