import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services';
import { RESPONSE_CODES } from '../constants/appConstants';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  updateUser: (user: User) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      
      login: async (credentials) => {
        set({ loading: true });
        try {
          const response = await authService.login(credentials);
          
          if (response.code === RESPONSE_CODES.LOGIN_SUCCESS) {
            const user: User = {
              id: response.result.id,
              email: response.result.email,
              firstname: response.result.firstname,
              lastname: response.result.lastname,
              contact: response.result.contact,
              username: response.result.username,
              role: response.result.role as 'Admin' | 'User' | undefined,
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
            
            // Merge guest cart when user logs in
            const cartStore = useCartStore.getState();
            cartStore.mergeGuestCart();
            
            return true;
          }
          
          set({ loading: false });
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          set({ loading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ loading: true });
        try {
          const response = await authService.register(userData);
          
          if (response.code === RESPONSE_CODES.REGISTER_SUCCESS) {
            const user: User = {
              id: response.result.id,
              email: response.result.email,
              firstname: response.result.firstname,
              lastname: response.result.lastname,
              contact: response.result.contact,
              username: response.result.username,
              role: response.result.role as 'Admin' | 'User' | undefined,
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
            
            // Merge guest cart when user registers
            const cartStore = useCartStore.getState();
            cartStore.mergeGuestCart();
            
            return true;
          }
          
          set({ loading: false });
          return false;
        } catch (error) {
          console.error('Registration failed:', error);
          set({ loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint to clear server-side cookies
          await authService.logout();
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue with client-side logout even if API fails
        } finally {
          // Clear client-side state
          set({ 
            user: null, 
            isAuthenticated: false 
          });
        }
      },

      verifyToken: async () => {
        try {
          const response = await authService.verifyToken();
          
          if (response.code === RESPONSE_CODES.TOKEN_VERIFIED) {
            const user: User = {
              id: response.result.id,
              email: response.result.email,
              firstname: response.result.firstname,
              lastname: response.result.lastname,
              contact: response.result.contact,
              username: response.result.username,
              role: response.result.role as 'Admin' | 'User' | undefined,
            };
            
            set({ 
              user, 
              isAuthenticated: true 
            });
            return true;
          }
          
          set({ 
            user: null, 
            isAuthenticated: false 
          });
          return false;
        } catch (error) {
          console.error('Token verification failed:', error);
          set({ 
            user: null, 
            isAuthenticated: false 
          });
          return false;
        }
      },

      initialize: async () => {
        // Check if we have any stored auth state
        const state = get();
        if (state.user && state.isAuthenticated) {
          // Verify the token is still valid
          const isValid = await get().verifyToken();
          if (!isValid) {
            // Token is invalid, clear the state
            get().logout();
          }
        }
      },

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);