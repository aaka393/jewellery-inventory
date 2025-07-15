// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, TableData } from '../types';
import { nanoid } from 'nanoid'; 

interface CartState {
  items: CartItem[];
  addItem: (product: TableData) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const generateKey = (product: TableData): string =>
  `${product.name}-${product.category}-${product.description}`; // You can change this logic

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: TableData) => {
  const items = get().items;

  // Check for match by name + description + price (not by id)
  const existingItem = items.find(item =>
    item.name === product.name &&
    item.description === product.description &&
    item.price === product.price
  );

  if (existingItem) {
    set({
      items: items.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    });
  } else {
    set({
      items: [...items, {
        ...product,
        id: nanoid(), // ✅ Add unique id here
        quantity: 1,
        image: product.images?.[0] // Optional shortcut
      }]
    });
  }
},


      removeItem: (key: string) => {
        set({
          items: get().items.filter(item => generateKey(item) !== key)
        });
      },

      updateQuantity: (key: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }

        set({
          items: get().items.map(item =>
            generateKey(item) === key ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price =
            typeof item.price === 'string'
              ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
              : item.price;
          return total + price * item.quantity;
        }, 0);
      },


      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
