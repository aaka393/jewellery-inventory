import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, Product, LoadingState } from '../types';

interface CartStore extends LoadingState {
  // State
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  
  // Actions
  addToCart: (product: Product, quantity?: number, isPreorder?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
  
  // Computed values
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        totalItems: 0,
        totalAmount: 0,
        isLoading: false,
        error: null,

        // Actions
        addToCart: (product, quantity = 1, isPreorder = false) => {
          const { items } = get();
          const existingItem = items.find(item => item.productId === product.id);

          let newItems: CartItem[];
          
          if (existingItem) {
            newItems = items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              productId: product.id,
              product,
              quantity,
              isPreorder: isPreorder || product.preorderAvailable,
            };
            newItems = [...items, newItem];
          }

          set({ items: newItems });
          get().calculateTotals();
        },

        removeFromCart: (productId) => {
          const { items } = get();
          const newItems = items.filter(item => item.productId !== productId);
          set({ items: newItems });
          get().calculateTotals();
        },

        updateQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }

          const { items } = get();
          const newItems = items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );
          
          set({ items: newItems });
          get().calculateTotals();
        },

        clearCart: () => {
          set({ items: [], totalItems: 0, totalAmount: 0 });
        },

        getCartItem: (productId) => {
          const { items } = get();
          return items.find(item => item.productId === productId);
        },

        calculateTotals: () => {
          const { items } = get();
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
          
          set({ totalItems, totalAmount });
        },
      }),
      {
        name: 'cart-store',
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
          totalAmount: state.totalAmount,
        }),
        onRehydrateStorage: () => (state) => {
          // Recalculate totals after rehydration
          if (state) {
            state.calculateTotals();
          }
        },
      }
    ),
    { name: 'cart-store' }
  )
);