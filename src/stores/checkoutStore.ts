import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number; // in paise
};

export interface CheckoutStore {
  cartItems: CartItem[];
  customer: {
    name: string;
    email: string;
    contact: string;
    customerId: string;
  } | null;
  setCartItems: (items: CartItem[]) => void;
  setCustomer: (customer: CheckoutStore["customer"]) => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      customer: null,

      setCartItems: (items) => set({ cartItems: items }),
      
      setCustomer: (customer) => set({ customer }),

      addToCart: (item) => set((state) => {
        const existingItem = state.cartItems.find(cartItem => cartItem.productId === item.productId);
        if (existingItem) {
          return {
            cartItems: state.cartItems.map(cartItem =>
              cartItem.productId === item.productId
                ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                : cartItem
            )
          };
        }
        return {
          cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }]
        };
      }),

      removeFromCart: (productId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.productId !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            cartItems: state.cartItems.filter(item => item.productId !== productId)
          };
        }
        return {
          cartItems: state.cartItems.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        };
      }),

      clearCart: () => set({ cartItems: [] }),

      getTotalAmount: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'checkout-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        customer: state.customer
      })
    }
  )
);